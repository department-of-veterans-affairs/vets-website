import { addDays } from 'date-fns';

export const notificationSuccessNotDismissed = ci => {
  let templateId = 'f9947b27-df3b-4b09-875c-7f76594d766d';
  if (ci) templateId = '7efc2b8b-e59a-4571-a2ff-0fd70253e973';

  return {
    data: [
      {
        id: 'e4213b12-eb44-4b2f-bac5-3384fbde0b7a',
        type: 'onsite_notifications',
        attributes: {
          templateId,
          vaProfileId: '1273780',
          dismissed: false,
          createdAt: addDays(new Date(), -3),
          updatedAt: undefined,
        },
      },
    ],
  };
};

export const notificationSuccessDismissed = ci => {
  let templateId = 'f9947b27-df3b-4b09-875c-7f76594d766d';
  if (ci) templateId = '7efc2b8b-e59a-4571-a2ff-0fd70253e973';

  return {
    data: {
      id: 'e4213b12-eb44-4b2f-bac5-3384fbde0b7a',
      type: 'onsite_notifications',
      attributes: {
        templateId,
        vaProfileId: '1273780',
        dismissed: true,
        createdAt: addDays(new Date(), -3),
        updatedAt: new Date(),
      },
    },
  };
};

export const multipleNotificationSuccess = ci => {
  let templateId = 'f9947b27-df3b-4b09-875c-7f76594d766d';
  if (ci) templateId = '7efc2b8b-e59a-4571-a2ff-0fd70253e973';

  return {
    data: [
      {
        id: 'e4213b12-eb44-4b2f-bac5-3384fbde0b7a',
        type: 'onsite_notifications',
        attributes: {
          templateId,
          vaProfileId: '1273780',
          dismissed: false,
          createdAt: addDays(new Date(), -3),
          updatedAt: undefined,
        },
      },
      {
        id: '700a1a99-5736-49ca-945e-7feb7fe79216',
        type: 'onsite_notifications',
        attributes: {
          templateId,
          vaProfileId: '1273780',
          dismissed: false,
          createdAt: addDays(new Date(), -5),
          updatedAt: undefined,
        },
      },
    ],
  };
};

export const notificationsSuccessEmpty = () => {
  return {
    data: [],
  };
};

export const notificationsError = () => {
  return {
    errors: [
      {
        title: 'Server Error',
        code: '500',
        status: '500',
      },
    ],
  };
};
