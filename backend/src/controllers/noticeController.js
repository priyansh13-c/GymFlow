import Notice from '../models/Notice.js';

// Post notice (gym owner only)
export const postNotice = async (req, res) => {
  try {
    let { gymId, title, content, priority = 'medium', expiryDate } = req.body;
    // map legacy 'normal' to 'medium'
    if (priority === 'normal') priority = 'medium';

    if (!gymId || !title || !content) {
      return res.status(400).json({ message: 'gymId, title, and content are required' });
    }

    const notice = new Notice({
      gym: gymId,
      postedBy: req.userId,
      title,
      content,
      priority,
      expiryDate,
    });

    await notice.save();
    
    // Populate with user data
    const populatedNotice = await Notice.findById(notice._id).populate('postedBy', 'name email');

    res.status(201).json({
      message: 'Notice posted successfully',
      notice: populatedNotice,
    });
  } catch (error) {
    console.error('Post notice error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get notices
export const getNotices = async (req, res) => {
  try {
    const { gymId } = req.query; // Support both param and query
    const gymIdParam = req.params.gymId || gymId;
    const { priority } = req.query;

    if (!gymIdParam) {
      return res.status(400).json({ message: 'Gym ID is required' });
    }

    let query = { gym: gymIdParam };
    if (priority) {
      query.priority = priority;
    }

    let notices = await Notice.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    // normalize legacy priority values
    notices = notices.map((n) => {
      if (n.priority === 'normal') {
        n.priority = 'medium';
      }
      return n;
    });

    res.status(200).json({
      count: notices.length,
      notices,
    });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mark notice as read
export const markNoticeRead = async (req, res) => {
  try {
    const { noticeId } = req.params;

    await Notice.findByIdAndUpdate(
      noticeId,
      {
        $addToSet: {
          readBy: {
            memberId: req.userId,
            readAt: new Date(),
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ message: 'Notice marked as read' });
  } catch (error) {
    console.error('Mark notice read error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update notice (gym owner only)
export const updateNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const updates = req.body;

    const notice = await Notice.findByIdAndUpdate(noticeId, updates, { new: true });

    res.status(200).json({
      message: 'Notice updated',
      notice,
    });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete notice (gym owner only)
export const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;

    await Notice.findByIdAndUpdate(noticeId, { isActive: false });

    res.status(200).json({ message: 'Notice deleted' });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ message: error.message });
  }
};
