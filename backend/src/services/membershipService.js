import Membership from '../models/Membership.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

/**
 * Check membership expiry and send notifications
 * Run daily via cron job
 */
export const checkMembershipExpiry = async () => {
  try {
    const today = new Date();
    
    // Find memberships expiring within 7 days and not yet reminded
    const expiringMemberships = await Membership.find({
      endDate: {
        $gte: today,
        $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      renewalReminderSent: { $exists: false },
      isActive: true,
    }).populate('member gym');

    console.log(`Found ${expiringMemberships.length} expiring memberships`);

    // Update each membership and send notification
    for (const membership of expiringMemberships) {
      const daysRemaining = Math.ceil(
        (membership.endDate - today) / (1000 * 60 * 60 * 24)
      );

      // Send notification (via socket.io)
      // In production, integrate with your socket.io instance
      console.log(
        `Member ${membership.member.email} has ${daysRemaining} days remaining`
      );

      // Mark reminder as sent
      membership.renewalReminder = true;
      membership.renewalReminderSent = new Date();
      await membership.save();
    }

    return expiringMemberships.length;
  } catch (error) {
    console.error('Error checking membership expiry:', error);
    throw error;
  }
};

/**
 * Deactivate expired memberships
 */
export const deactivateExpiredMemberships = async () => {
  try {
    const today = new Date();

    const result = await Membership.updateMany(
      { endDate: { $lt: today }, isActive: true },
      { isActive: false }
    );

    console.log(`Deactivated ${result.modifiedCount} expired memberships`);
    return result.modifiedCount;
  } catch (error) {
    console.error('Error deactivating memberships:', error);
    throw error;
  }
};
