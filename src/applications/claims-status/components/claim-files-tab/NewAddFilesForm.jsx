import React, { useRef, useState } from 'react';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function AddFilesForm() {
  const fileInputMultipleRef = useRef(null);
  const [filesWithMeta, setFilesWithMeta] = useState([]);

  const updateFiles = fileState => {
    const fileInputs = Array.from(
      fileInputMultipleRef.current.shadowRoot.querySelectorAll('va-file-input'),
    );

    setFilesWithMeta(
      fileState.map((f, i) => ({
        file: f.file,
        password: f.password ?? '',
        fileTypeId: fileInputs[i]?.querySelector('va-select')?.value ?? '',
      })),
    );
  };

  const handleFiles = e => updateFiles(e.detail.state);
  const handleSelect = () => updateFiles(filesWithMeta);

  return (
    <>
      <VaFileInputMultiple
        ref={fileInputMultipleRef}
        name="my-file-input"
        label="Select a file to upload"
        hint="You can upload a .pdf, .gif, .jpg, .bmp, or .txt file."
        enableAnalytics={false}
        onVaMultipleChange={handleFiles}
        onVaSelect={handleSelect}
      >
        <VaSelect name="fileType" label="What kind of file is this?" required>
          <option value="1">Public Document</option>
          <option value="2">Private Document</option>
        </VaSelect>
      </VaFileInputMultiple>
      <va-button
        enableAnalytics={false}
        text="Submit files"
        onClick={() => console.log('payload', filesWithMeta)}
      />
    </>
  );
}

// BUG: The fileTypes were accurate: [{file: File, fileTypeId: '2', password: ''}, {file: File, fileTypeId: '1', password: ''}]. I then deleted the first file and didn't change the seconds select and got: [{file: File, fileTypeId: '2', password: ''}]. It should be [{file: File, fileTypeId: '2', password: ''}]
