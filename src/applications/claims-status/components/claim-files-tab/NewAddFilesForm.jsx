import React, { useRef, useState } from 'react';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function AddFilesForm() {
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [meta, setMeta] = useState({}); // { "3": "2", "4": "1", … }

  /* 1️⃣  update files array */
  const handleFiles = e => setFiles(e.detail.state);

  /* 2️⃣  map select → file’s permanent key */
  const handleSelect = e => {
    const vaFile = e
      .composedPath()
      .find(el => el.tagName?.toLowerCase() === 'va-file-input');
    const key = (vaFile?.name ?? '').split('-').pop(); // e.g. "4"
    if (key) setMeta(prev => ({ ...prev, [key]: e.detail.value }));
  };

  /* 3️⃣  build payload (use the same key to look up the meta) */
  const buildPayload = () => {
    const fileInputs = Array.from(
      fileInputRef.current.shadowRoot.querySelectorAll('va-file-input'),
    );
    return files.map((fileObj, i) => {
      const key = (fileInputs[i]?.name ?? '').split('-').pop(); // "3", "4", …
      return {
        file: fileObj.file,
        fileTypeId: meta[key], // always lines up, even after deletes
        password: fileObj.password ?? '',
      };
    });
  };

  return (
    <>
      <VaFileInputMultiple
        ref={fileInputRef}
        name="my-file-input"
        label="Select a file to upload"
        hint="You can upload a .pdf, .gif, .jpg, .bmp, or .txt file."
        onVaMultipleChange={handleFiles}
        onVaSelect={handleSelect}
      >
        {/* cloned for every file card */}
        <VaSelect label="What kind of file is this?" required>
          <option value="1">Public Document</option>
          <option value="2">Private Document</option>
        </VaSelect>
      </VaFileInputMultiple>

      <va-button
        text="Submit files"
        onClick={() => {
          console.log('payload', buildPayload());
          /* 🔗 send buildPayload() to your API */
        }}
      />
    </>
  );
}
