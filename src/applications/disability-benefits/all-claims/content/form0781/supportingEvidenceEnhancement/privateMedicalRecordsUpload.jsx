import React from 'react';
import { uploadAdditionalInfo } from './uploadAdditionalInfo';

export const pmrTitle = 'Upload copies of private medical records';

const pmrBody = (
  <>
    <p>Upload copies of your private medical records to support your claim.</p>
  </>
);

export const pmrDescription = (
  <>
    {pmrBody}
    {uploadAdditionalInfo}
  </>
);
