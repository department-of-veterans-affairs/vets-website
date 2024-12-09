import { showScNewForm } from './toggle';

import { MST_OPTION } from '../constants';

export const hasMstOption = formData =>
  showScNewForm(formData) && formData?.[MST_OPTION];
