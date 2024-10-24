import _ from 'lodash';

export function prefillTransformer(pages, formData, metadata, state) {
  const { homePhone, mobilePhone, email, remainingEntitlement } = formData;
  const { edipi, icn } = state.user.profile;

  const totalDays = remainingEntitlement
    ? remainingEntitlement.months * 30 + remainingEntitlement.days
    : 0;

  const newFormData = {
    ..._.omit(formData, [
      'homePhone',
      'mobilePhone',
      'email',
      'remainingEntitlement',
      'edipi',
      'icn',
    ]),
    'view:otherContactInfo': {
      homePhone,
      mobilePhone,
      email,
    },
    'view:remainingEntitlement': {
      ...remainingEntitlement,
      totalDays,
    },
    edipi,
    icn,
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
