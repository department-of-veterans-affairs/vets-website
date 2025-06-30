import React from 'react';

import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const NewAddFilesForm = () => (
  <VaFileInputMultiple
    hint="You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 150 MB (PDF only)."
    label="Upload additional evidence"
  />
);

export default NewAddFilesForm;
