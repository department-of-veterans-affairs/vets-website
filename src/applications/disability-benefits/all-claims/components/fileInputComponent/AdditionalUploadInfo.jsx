import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const additionalInfo = (
  <VaAdditionalInfo trigger="How to prepare your files">
    <p>
      If your document is digital, make sure it’s one of the accepted file
      types.
    </p>
    <p>
      Before you upload your files, make sure they’re saved on the device you’re
      using to submit this claim. You can do this in 1 of 2 ways:
    </p>
    <ul>
      <li>
        On a computer connected to a scanner, scan each document and save the
        file as a PDF.
      </li>
      <li>
        On a smartphone, take a photo of the document or use a scanning app to
        save it as a PDF.
      </li>
    </ul>
  </VaAdditionalInfo>
);
