import Payment from '../models/Payment.js';
import Gym from '../models/Gym.js';

/**
 * Get gym revenue analytics
 */
export const getGymAnalytics = async (gymId) => {
  try {
    // Get current month revenue
    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const currentMonthRevenue = await Payment.aggregate([
      {
        $match: {
          gym: gymId,
          status: 'completed',
          paymentDate: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Get last 12 months revenue for graph
    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          gym: gymId,
          status: 'completed',
          paymentDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return {
      currentMonthRevenue: currentMonthRevenue[0]?.total || 0,
      monthlyRevenue,
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
};

/**
 * Generate payment report
 */
export const getPaymentReport = async (gymId, dateRange = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    const payments = await Payment.find({
      gym: gymId,
      paymentDate: { $gte: startDate },
    })
      .populate('member', 'name email')
      .sort({ paymentDate: -1 });

    const summary = {
      totalPayments: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      completedPayments: payments.filter((p) => p.status === 'completed').length,
      pendingPayments: payments.filter((p) => p.status === 'pending').length,
      failedPayments: payments.filter((p) => p.status === 'failed').length,
    };

    return { summary, payments };
  } catch (error) {
    console.error('Error generating payment report:', error);
    throw error;
  }
};
