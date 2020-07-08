import _ from 'lodash';

export function prefillTransformer(pages, formData, metadata) {
  const { homePhone, email, remainingEntitlement } = formData;

  const totalDays = remainingEntitlement
    ? remainingEntitlement.months * 30 + remainingEntitlement.days
    : 0;

  const newFormData = {
    ..._.omit(formData, ['homePhone', 'email', 'remainingEntitlement']),
    'view:otherContactInfo': {
      homePhone,
      email,
    },
    'view:remainingEntitlement': {
      ...remainingEntitlement,
      totalDays,
    },
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
