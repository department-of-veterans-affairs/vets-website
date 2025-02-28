import { kebabCase } from 'lodash';

import * as VAP_SERVICE from 'platform/user/profile/vap-svc/constants';

export const getEditButtonId = fieldName => {
  return `edit-${kebabCase(VAP_SERVICE.FIELD_TITLES[fieldName])}`;
};
