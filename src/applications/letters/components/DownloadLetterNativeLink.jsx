import React from 'react';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const DownloadLetterNativeLink = ({ letterTitle }) => {
  return <VaLink href="#" filetype="PDF" text={letterTitle} download />;
};

export default DownloadLetterNativeLink;
