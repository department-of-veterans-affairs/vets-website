import React from 'react';

import DocumentUpload from '../../components/DocumentUpload';
import MultipleDocumentUpload from '../../components/MultipleDocumentUpload';

const TestDocumentUploadPage = () => {
  return (
    <div className="vads-l-grid-container vads-u-padding-y--3">
      <h1>Test Document Upload</h1>
      <h2>Single Document Upload</h2>
      <DocumentUpload />
      <h2>Multiple Document Upload</h2>
      <MultipleDocumentUpload />
    </div>
  );
};

export default TestDocumentUploadPage;
