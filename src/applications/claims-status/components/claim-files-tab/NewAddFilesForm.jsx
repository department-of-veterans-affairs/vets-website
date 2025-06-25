import React, { useRef, useState } from 'react';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function AddFilesForm() {
  const fileInputMultipleRef = useRef(null);
  const [fileState, setFileState] = useState([]);

  const handleFileChange = e => setFileState(e.detail.state);

  const buildPayload = () => {
    const fileInputs = Array.from(
      fileInputMultipleRef.current.shadowRoot.querySelectorAll('va-file-input'),
    );

    return fileState.map((f, i) => {
      const fileTypeId = fileInputs[i]?.querySelector('va-select')?.value ?? '';
      return {
        file: f.file,
        password: f.password ?? '',
        fileTypeId,
      };
    });
  };

  return (
    <>
      <VaFileInputMultiple
        ref={fileInputMultipleRef}
        name="my-file-input"
        label="Select a file to upload"
        hint="You can upload a .pdf, .gif, .jpg, .bmp, or .txt file."
        onVaMultipleChange={handleFileChange}
      >
        <VaSelect label="What kind of file is this?" required name="fileType">
          <option value="1">1</option>
          <option value="2">2</option>
        </VaSelect>
      </VaFileInputMultiple>

      <va-button
        text="Submit files"
        onClick={() => console.log('payload', buildPayload())}
      />
    </>
  );
}
