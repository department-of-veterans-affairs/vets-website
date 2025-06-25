import React from 'react';

import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function AdditionalFormInputsContent() {
  const onVaSelect = event => {
    console.log('onVaSelect event', event);
  };

  return (
    <div>
      <VaSelect
        label="What kind of file is this?"
        name="fileType"
        required
        onVaSelect={onVaSelect}
      >
        <option key="1" value="1">
          Public Document
        </option>
        <option key="2" value="2">
          Private Document
        </option>
      </VaSelect>
    </div>
  );
}

export default function NewAddFilesForm() {
  const onVaMultipleChange = event => {
    console.log('onVaMultipleChange event', event);
  };

  return (
    <div>
      <h2>Add files form</h2>
      <AdditionalFormInputsContent />
      <VaFileInputMultiple
        label="Select a file to upload"
        name="my-file-input"
        accept={null}
        required={false}
        errors={[]}
        encrypted={[]}
        // enableAnalytics
        hint="You can upload a .pdf, .gif, .jpg, .bmp, or .txt file."
        onVaMultipleChange={onVaMultipleChange}
        value={null}
        // slotFieldIndexes={[1, 2]}
      >
        <AdditionalFormInputsContent />
      </VaFileInputMultiple>
    </div>
  );
}
