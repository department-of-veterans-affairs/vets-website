export const labels = {
  Spouse: {
    removalReasonTitle: fullName => `Reason for removing ${fullName}`,
    removalReasonHint: 'If more than one applies, select what happened first.',
    removalReason: 'Why do you need to remove this dependent?',
    removalReasonError: 'Select a reason',
    marriageEnded: 'You’re no longer married to them',
    divorce: 'You got divorced',
    annulmentOrVoid: 'Your marriage was annulled or declared void',
    death: 'They died',
  },
  Parent: {
    removalReasonTitle: fullName => `Reason for removing ${fullName}`,
    removalReasonHint: 'If more than one applies, select what happened first.',
    removalReason: 'Why do you need to remove this dependent?',
    removalReasonError: 'Select a reason',
    parentOther: 'Something else happened',
    parentDied: 'They died',
  },
  Child: {
    isStepChildTitle: (fullName, age) =>
      `Is ${fullName} (age ${age}) your stepchild?`,
    isStepChildError: 'Select an option',
    isStepChildYes: 'Yes',
    isStepChildNo: 'No',

    removalReasonTitle: fullName => `Reason for removing ${fullName}`,
    removalReasonHint: 'If more than one applies, select what happened first.',
    removalReason: 'Why do you need to remove this dependent?',
    removalReasonError: 'Select a reason',
    childNotInSchool: 'They’re no longer enrolled in school',
    stepchildNotMember: 'They no longer live with you',
    childAdopted: 'They were adopted by another family',
    childMarried: 'They got married',
    childDied: 'They died',
  },
};
