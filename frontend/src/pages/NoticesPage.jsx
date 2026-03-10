import { useState, useEffect } from 'react';
import { noticeService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
  });
  const { user } = useAuth();

  const gymId = 'test-gym-id'; // Replace with actual gym ID

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      // const response = await noticeService.getNotices(gymId);
      // setNotices(response.data.notices);
      
      // Mock data
      setNotices([
        {
          _id: '1',
          title: 'New Equipment Arrived',
          content: 'We have installed new cardio machines on the second floor.',
          priority: 'high',
          postedBy: { name: 'Admin', _id: '123' },
          createdAt: new Date().toISOString(),
          readBy: [],
        },
        {
          _id: '2',
          title: 'Maintenance Schedule',
          content: 'The gym will be closed on Sunday for maintenance.',
          priority: 'medium',
          postedBy: { name: 'Admin', _id: '123' },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          readBy: [],
        },
      ]);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await noticeService.postNotice(gymId, formData);
      setFormData({ title: '', content: '', priority: 'medium' });
      setShowForm(false);
      fetchNotices();
    } catch (error) {
      console.error('Error posting notice:', error);
    }
  };

  const handleMarkRead = async (noticeId) => {
    try {
      // await noticeService.markNoticeRead(noticeId);
      setNotices(
        notices.map((notice) =>
          notice._id === noticeId
            ? {
                ...notice,
                readBy: [
                  ...notice.readBy,
                  { memberId: user?._id, readAt: new Date().toISOString() },
                ],
              }
            : notice
        )
      );
    } catch (error) {
      console.error('Error marking notice as read:', error);
    }
  };

  if (loading) return <div className='text-center py-10'>Loading...</div>;

  const isOwner = user?.role === 'gym_owner';

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-800'>Notices</h1>
        {isOwner && (
          <button
            onClick={() => setShowForm(!showForm)}
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded'
          >
            {showForm ? 'Cancel' : 'Post Notice'}
          </button>
        )}
      </div>

      {/* Post Notice Form */}
      {showForm && isOwner && (
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
          <h2 className='text-2xl font-bold mb-4'>Post New Notice</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Title</label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className='w-full border rounded px-4 py-2'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className='w-full border rounded px-4 py-2 h-32'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className='w-full border rounded px-4 py-2'
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded'
            >
              Post Notice
            </button>
          </form>
        </div>
      )}

      {/* Notices List */}
      <div className='space-y-4'>
        {notices.map((notice) => {
          const isRead = notice.readBy?.some((r) => r.memberId === user?._id);
          return (
            <div
              key={notice._id}
              className={`rounded-lg shadow-lg p-6 border-l-4 ${
                notice.priority === 'high'
                  ? 'border-red-500 bg-red-50'
                  : notice.priority === 'medium'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-green-500 bg-green-50'
              }`}
            >
              <div className='flex justify-between items-start mb-2'>
                <div className='flex-1'>
                  <h3 className='text-2xl font-bold text-gray-800'>{notice.title}</h3>
                  <p className='text-sm text-gray-600'>
                    Posted by {notice.postedBy?.name} on{' '}
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    isRead
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-blue-200 text-blue-700'
                  }`}
                >
                  {isRead ? 'Read' : 'New'}
                </span>
              </div>

              <p className='text-gray-700 mb-4'>{notice.content}</p>

              {!isOwner && !isRead && (
                <button
                  onClick={() => handleMarkRead(notice._id)}
                  className='text-blue-600 hover:text-blue-800 font-semibold text-sm'
                >
                  Mark as Read
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
