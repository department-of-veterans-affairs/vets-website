import React from 'react';

import { MAX_LENGTH } from '../../../shared/constants';

const title = 'Tell us why you have a good cause for an extension';

export const content = {
  title: <h1 className="vads-u-margin-y--0">{title}</h1>,
  label: 'Reason for requesting an extension:',
  hint: `${MAX_LENGTH.NOD_EXTENSION_REASON} characters max.`,
  errorMessage: 'This field cannot be left blank.',
};
