import get from 'platform/forms-system/src/js/utilities/data/get';

export const usingDirectDeposit = formData =>
  get(['view:usingDirectDeposit'], formData) === true;
