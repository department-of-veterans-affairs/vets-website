import React from 'react';

import { MAX_LENGTH } from '../../../shared/constants';

const title = 'What else do you want to tell us about your disagreement?';

export const content = {
  title,
  titleH1: <h1 className="vads-u-margin-y--0">{title}</h1>,
  label:
    'Tell us more information about your disagreement, or upload a document in the following step',
  hint: `${MAX_LENGTH.NOD_EXTENSION_REASON} characters max.`,
  errorMessage: 'This field cannot be left blank.',
};
