import Payment from '../models/Payment.js';
import Membership from '../models/Membership.js';
import Gym from '../models/Gym.js';

// Process payment
export const processPayment = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { membershipId, amount, paymentMethod, transactionId } = req.body;

    // Create payment record
    const payment = new Payment({
      member: req.userId,
      gym: gymId,
      membership: membershipId,
      amount,
      paymentMethod,
      transactionId,
      status: 'completed',
      description: `Membership payment for ${membershipId}`,
    });

    await payment.save();

    // Update membership to paid
    await Membership.findByIdAndUpdate(membershipId, { isPaid: true });

    // Update gym revenue
    await Gym.findByIdAndUpdate(gymId, {
      $inc: { totalRevenue: amount },
    });

    res.status(201).json({
      message: 'Payment processed successfully',
      payment,
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get payment history (member)
export const getPaymentHistory = async (req, res) => {
  try {
    const { gymId } = req.params;

    const payments = await Payment.find({
      member: req.userId,
      gym: gymId,
    }).sort({ paymentDate: -1 });

    res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all gym payments (admin)
export const getGymPayments = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { status, startDate, endDate } = req.query;

    let query = { gym: gymId };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) {
        query.paymentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.paymentDate.$lte = new Date(endDate);
      }
    }

    const payments = await Payment.find(query)
      .populate('member', 'name email')
      .sort({ paymentDate: -1 });

    const summary = {
      totalPayments: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      completedCount: payments.filter((p) => p.status === 'completed').length,
      pendingCount: payments.filter((p) => p.status === 'pending').length,
    };

    res.status(200).json({
      summary,
      payments,
    });
  } catch (error) {
    console.error('Get gym payments error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Refund payment (admin)
export const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: 'refunded' },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update gym revenue
    await Gym.findByIdAndUpdate(payment.gym, {
      $inc: { totalRevenue: -payment.amount },
    });

    res.status(200).json({
      message: 'Payment refunded successfully',
      payment,
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ message: error.message });
  }
};
