export const schema = {
  type: 'object',
  properties: {
    'view:selectable686Options': {
      type: 'object',
      properties: {
        'view:addChild': { type: 'boolean' },
        'view:addSpouse': { type: 'boolean' },
        'view:reportDivorce': { type: 'boolean' },
        'view:reportDeath': { type: 'boolean' },
        'view:reportChildNotInHousehold': { type: 'boolean' },
        'view:reportMarriageOfChildUnder18': { type: 'boolean' },
        'view:reportChild18OrOlderIsNotAttendingSchool': {
          type: 'boolean',
        },
        'view:requestApprovalOfSchoolAttendanceOfChild18OrOlder': {
          type: 'boolean',
        },
      },
    },
  },
};

export const uiSchema = {
  'view:selectable686Options': {
    'ui:options': { showFieldLabel: true },
    'ui:title': 'What would you like to do? (Check all that apply)',
    'view:addChild': {
      'ui:title': 'Claim additional benefits for a child',
    },
    'view:addSpouse': {
      'ui:title': 'Claim additional benefits for a spouse',
    },
    'view:reportDivorce': {
      'ui:title': 'Report a divorce',
    },
    'view:reportChildNotInHousehold': {
      'ui:title':
        'Report that a stepchild is no longer a member of your household',
    },
    'view:reportDeath': {
      'ui:title': 'Report the death of a spouse, child or dependent parent',
    },
    'view:reportMarriageOfChildUnder18': {
      'ui:title': 'Report the marriage of a child under 18',
    },
    'view:reportChild18OrOlderIsNotAttendingSchool': {
      'ui:title':
        'Report that a child 18 or older has stopped attending school',
    },
    'view:requestApprovalOfSchoolAttendanceOfChild18OrOlder': {
      'ui:title': 'Request approval of school attendance for child 18 or older',
    },
  },
};
