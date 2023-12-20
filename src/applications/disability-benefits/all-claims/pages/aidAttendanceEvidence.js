export const uiSchema = {
  'ui:title': 'Aid and Attendance benefits',
  'ui:description':
    'If you need help with everyday activities or are confined to your home because of your service-connected condition or disability, you may be eligible for extra help.',
  'view:aidAndAttendance': {
    'ui:title':
      'Are you confined to your home or need help with everyday activities?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:aidAndAttendance': {
      type: 'boolean',
    },
  },
};
