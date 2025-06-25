import React, { useRef, useState } from 'react';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function AddFilesForm() {
  const fimRef = useRef(null); // <va-file-input-multiple>
  const [files, setFiles] = useState([]); // from vaMultipleChange

  /* 1️⃣  keep only the files array */
  const handleFiles = e => setFiles(e.detail.state);

  /* 2️⃣  build payload lazily */
  const buildPayload = () => {
    const fileInputs = Array.from(
      fimRef.current.shadowRoot.querySelectorAll('va-file-input'),
    );

    return files.map((f, idx) => {
      const select = fileInputs[idx].querySelector('va-select');
      return {
        file: f.file,
        fileTypeId: select?.value ?? '', // "1", "2", or ""
        password: f.password ?? '',
      };
    });
  };

  return (
    <>
      <VaFileInputMultiple
        ref={fimRef}
        name="my-file-input"
        label="Select a file to upload"
        hint="You can upload a .pdf, .gif, .jpg, .bmp, or .txt file."
        onVaMultipleChange={handleFiles}
      >
        <VaSelect label="What kind of file is this?" required name="fileType">
          <option value="1">Public Document</option>
          <option value="2">Private Document</option>
        </VaSelect>
      </VaFileInputMultiple>

      <va-button
        text="Submit files"
        onClick={() => console.log('payload', buildPayload())}
      />
    </>
  );
}
