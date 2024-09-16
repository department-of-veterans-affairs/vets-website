const newDraft = (req, res) => {
  const { body, category, recipientId, subject } = req.body;
  return res.json({
    data: {
      id: '3885180',
      type: 'message_drafts',
      attributes: {
        messageId: 3885180,
        category,
        subject,
        body,
        attachment: false,
        sentDate: null,
        senderId: 2991831,
        senderName: 'LEE, JAMIE',
        recipientId,
        recipientName: 'DETROIT: Dermatology, Bishop, Walter, Md',
        readReceipt: null,
        triageGroupName: null,
        proxySenderName: null,
      },
      relationships: {
        attachments: {
          data: [],
        },
      },
      links: {
        self: 'http://127.0.0.1:3000/my_health/v1/messaging/messages/3885180',
      },
    },
  });
};

const sendDraft = (req, res) => {
  const { body, category, recipientId, subject } = req.body;

  return res.json({
    data: {
      id: '3885180',
      type: 'messages',
      attributes: {
        messageId: 3885180,
        category,
        subject,
        body,
        attachment: false,
        sentDate: '2023-03-20T18:38:54.000Z',
        senderId: 1835650,
        senderName: 'RATANA, NARIN ',
        recipientId,
        recipientName: 'FREEMAN, MELVIN  V',
        readReceipt: 'READ',
        triageGroupName: 'VA Flagship mobile applications interface 1_DAYT29',
        proxySenderName: null,
      },
      relationships: { attachments: { data: [] } },
      links: {
        self:
          'https://staging-api.va.gov/my_health/v1/messaging/messages/2711197',
      },
    },
  });
};

const saveReply = (req, res) => {
  const { body, category, recipientId, subject } = req.body;
  return res.json({
    data: {
      id: '3885180',
      type: 'message_drafts',
      attributes: {
        messageId: 3885180,
        category,
        subject,
        body,
        attachment: false,
        sentDate: null,
        senderId: 2991831,
        senderName: 'LEE, JAMIE',
        recipientId,
        recipientName: 'DETROIT: Dermatology, Bishop, Walter, Md',
        readReceipt: null,
        triageGroupName: null,
        proxySenderName: null,
      },
      relationships: {
        attachments: {
          data: [],
        },
      },
      links: {
        self: 'http://127.0.0.1:3000/my_health/v1/messaging/messages/3885180',
      },
    },
  });
};

const updateDraft = (req, res) => {
  return res.status(204).json();
};

const deleteDraft = (req, res) => {
  return res.status(204).json();
};

module.exports = {
  newDraft,
  sendDraft,
  updateDraft,
  deleteDraft,
  saveReply,
};
