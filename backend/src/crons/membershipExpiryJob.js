import cron from 'node-cron';
import {
  checkMembershipExpiry,
  deactivateExpiredMemberships,
} from '../services/membershipService.js';

/**
 * Membership Expiry Job - Runs daily at 09:00 AM
 * Checks for memberships expiring within 7 days and sends reminders
 */
export const startMembershipExpiryJob = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('✓ Running membership expiry check job...');
      await checkMembershipExpiry();
      await deactivateExpiredMemberships();
      console.log('✓ Membership expiry job completed');
    } catch (error) {
      console.error('✗ Membership expiry job failed:', error);
    }
  });

  console.log('✓ Membership expiry job scheduled for 9:00 AM daily');
};

/**
 * Optional: Cleanup old notifications
 * Run weekly to delete notifications older than 30 days
 */
export const startNotificationCleanupJob = () => {
  cron.schedule('0 2 * * 0', async () => {
    try {
      console.log('✓ Running notification cleanup job...');
      // Implement cleanup logic here
      console.log('✓ Notification cleanup completed');
    } catch (error) {
      console.error('✗ Notification cleanup failed:', error);
    }
  });

  console.log('✓ Notification cleanup job scheduled for Sundays at 2:00 AM');
};

/**
 * Optional: Generate monthly analytics reports
 * Run on the first day of each month
 */
export const startAnalyticsJob = () => {
  cron.schedule('0 0 1 * *', async () => {
    try {
      console.log('✓ Running monthly analytics job...');
      // Implement analytics logic here
      console.log('✓ Monthly analytics generated');
    } catch (error) {
      console.error('✗ Analytics job failed:', error);
    }
  });

  console.log('✓ Analytics job scheduled for the 1st of every month at midnight');
};
