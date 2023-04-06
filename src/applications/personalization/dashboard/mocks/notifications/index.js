const createNotificationsSuccess = () => {
  const templateId = 'f9947b27-df3b-4b09-875c-7f76594d766d';

  return {
    data: [
      {
        id: 'e4213b12-eb44-4b2f-bac5-3384fbde0b7a',
        type: 'onsite_notifications',
        attributes: {
          templateId,
          vaProfileId: '1273780',
          dismissed: false,
          createdAt: new Date(2023, 2, 28),
          updatedAt: new Date(2023, 3, 1),
        },
      },
      {
        id: 'f9947b27-df3b-4b09-875c-7f76594d766d',
        type: 'onsite_notifications',
        attributes: {
          templateId,
          vaProfileId: '1273780',
          dismissed: false,
          createdAt: new Date(2023, 2, 28),
          updatedAt: new Date(2023, 3, 1),
        },
      },
    ],
  };
};

module.exports = {
  createNotificationsSuccess,
};
