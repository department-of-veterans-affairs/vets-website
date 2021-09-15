import React from 'react';
import FileInput from '@department-of-veterans-affairs/component-library/FileInput';

export const CoeDocumentUpload = () => {
  return (
    <>
      <h2>We need documents from you</h2>
      <p>
        We’ve sent a notification letter or email about documentation for your
        COE application. Please send us all the documents listed so we can make
        a decision about your application.
      </p>
      <FileInput buttonText="Upload this document" onChange={() => {}} />
    </>
  );
};
