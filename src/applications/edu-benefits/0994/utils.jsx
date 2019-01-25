import _ from '../../../platform/utilities/data';

export const technologyEmploymentRequired = formData =>
  !_.get('currentEmployment', formData, false);
