import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gymService, memberService, noticeService } from '../services/authService';
import { useSocket } from '../services/socketService';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Alert, LoadingPage, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui';
import { Users, UserCheck, Clock, DollarSign, Award, Megaphone, LineChart } from 'lucide-react';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [gym, setGym] = useState(null);
  const [members, setMembers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState('');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticePriority, setNoticePriority] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const socket = useSocket();

  useEffect(() => {
    fetchGymData();
  }, []);

  useEffect(() => {
    if (gym?._id) {
      fetchMembers();
      fetchNotices();

      if (socket) {
        socket.on('notice:received', handleNewNotice);
      }

      return () => {
        if (socket) {
          socket.off('notice:received', handleNewNotice);
        }
      };
    }
  }, [gym?._id, socket]);

  const fetchGymData = async () => {
    try {
      const response = await gymService.getOwnerGyms();
      if (response.data.gym) {
        setGym(response.data.gym);
      } else {
        window.location.href = '/owner/gym-setup';
      }
    } catch (err) {
      setError('Failed to load gym data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      if (gym?._id) {
        const response = await memberService.getGymMembers(gym._id);
        setMembers(response.data.members || []);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchNotices = async () => {
    try {
      if (gym?._id) {
        const response = await noticeService.getNotices(gym._id);
        setNotices(response.data.notices || []);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
    }
  };

  const handleNewNotice = (notice) => {
    setNotices([notice, ...notices]);
  };

  const handleSendNotice = async (e) => {
    e.preventDefault();
    if (!noticeTitle || !newNotice) {
      setError('Please enter both title and message');
      return;
    }

    try {
      await noticeService.createNotice(gym._id, {
        title: noticeTitle,
        content: newNotice,
        priority: noticePriority,
      });
      setNoticeTitle('');
      setNewNotice('');
      setNoticePriority('medium');
      setError('');
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notice');
    }
  };

  if (loading) return <LoadingPage message="Loading your gym dashboard..." />;

  if (!gym) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">No Gym Found</h2>
        <p className="text-neutral-600 mb-6">You need to set up your gym first.</p>
        <Link to="/owner/gym-setup">
          <Button size="lg">Set Up Gym</Button>
        </Link>
      </div>
    );
  }

  const activeMembers = members.filter(m => m.isPaid);
  const pendingPayments = members.filter(m => !m.isPaid);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{gym.gymName}</h1>
          <p className="text-neutral-600 mt-1">Manage your gym and members</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-500">Gym Code</p>
          <p className="text-2xl font-mono font-bold text-primary-600">{gym.gymCode}</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="mr-4 text-primary-500"><Users className="w-8 h-8" /></div>
              <div>
                <p className="text-sm text-neutral-600">Total Members</p>
                <p className="text-2xl font-bold text-neutral-900">{members.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="mr-4 text-success-500"><UserCheck className="w-8 h-8" /></div>
              <div>
                <p className="text-sm text-neutral-600">Active Members</p>
                <p className="text-2xl font-bold text-neutral-900">{activeMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="mr-4 text-warning-500"><Clock className="w-8 h-8" /></div>
              <div>
                <p className="text-sm text-neutral-600">Pending Payments</p>
                <p className="text-2xl font-bold text-neutral-900">{pendingPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="mr-4 text-success-600"><DollarSign className="w-8 h-8" /></div>
              <div>
                <p className="text-sm text-neutral-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-neutral-900">
                  ${activeMembers.reduce((sum, member) => {
                    const rate = member.membershipType === 'monthly' ? 30 :
                               member.membershipType === 'quarterly' ? 80 : 300;
                    return sum + rate;
                  }, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Gym Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-neutral-500">
                      No members yet
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell className="font-medium">{member.user?.name}</TableCell>
                      <TableCell className="capitalize">{member.membershipType}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          member.isPaid
                            ? 'bg-success-100 text-success-800'
                            : 'bg-warning-100 text-warning-800'
                        }`}>
                          {member.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Send Notice */}
        <Card>
          <CardHeader>
            <CardTitle>Send Notice</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendNotice} className="space-y-4">
              <Input
                label="Notice Title"
                type="text"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="e.g., Gym Maintenance"
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Priority Level
                </label>
                <div className="flex space-x-3">
                  {['low', 'medium', 'high'].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setNoticePriority(priority)}
                      className={`px-3 py-1 text-sm rounded-full capitalize transition-colors ${
                        noticePriority === priority
                          ? priority === 'high'
                            ? 'bg-error-100 text-error-800'
                            : priority === 'medium'
                            ? 'bg-warning-100 text-warning-800'
                            : 'bg-neutral-100 text-neutral-800'
                          : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Message
                </label>
                <textarea
                  value={newNotice}
                  onChange={(e) => setNewNotice(e.target.value)}
                  placeholder="Enter your notice message..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Send Notice
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notices.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">No notices sent yet</p>
            ) : (
              notices.slice(0, 5).map((notice) => (
                <Alert
                  key={notice._id}
                  type={notice.priority === 'high' ? 'error' : notice.priority === 'medium' ? 'warning' : 'info'}
                  title={notice.title}
                  message={notice.content}
                  className="border-l-4"
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/owner/members">
          <Card hover className="cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary-500" />
              <h3 className="font-semibold text-neutral-900">Manage Members</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/owner/trainers">
          <Card hover className="cursor-pointer">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-primary-500" />
              <h3 className="font-semibold text-neutral-900">Trainers</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/owner/notices">
          <Card hover className="cursor-pointer">
            <CardContent className="p-6 text-center">
              <Megaphone className="w-8 h-8 mx-auto mb-2 text-primary-500" />
              <h3 className="font-semibold text-neutral-900">All Notices</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/owner/analytics">
          <Card hover className="cursor-pointer">
            <CardContent className="p-6 text-center">
              <LineChart className="w-8 h-8 mx-auto mb-2 text-primary-500" />
              <h3 className="font-semibold text-neutral-900">Analytics</h3>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};
