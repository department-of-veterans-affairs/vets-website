import React from 'react';

import { MAX_LENGTH } from '../../10182/constants';

const title = 'What else do you want to tell us about your disagreement?';

export const content = {
  title: <h1 className="vads-u-margin-top--0">{title}</h1>,
  label:
    'Tell us more information about your disagreement, or upload a document in the following step',
  hint: `${MAX_LENGTH.EXTENSION_REASON} characters max.`,
  errorMessage: 'This field cannot be left blank.',
};
