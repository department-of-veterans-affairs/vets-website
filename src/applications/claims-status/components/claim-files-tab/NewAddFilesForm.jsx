import React, { useRef, useState } from 'react';
import {
  VaFileInputMultiple,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function AddFilesForm() {
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]); // from vaMultipleChange
  const [meta, setMeta] = useState({}); // { 0: '1', 1: '2', … }

  /* ---------- 1. files array ---------- */
  const handleFiles = e => setFiles(e.detail.state);

  /* ---------- 2. select changes ---------- */
  const handleSelect = e => {
    const path = e.composedPath();

    // whichever va-select fired, the 1st ancestor in the path that _is_ a <va-file-input>
    const vaFileInputEl = path.find(
      el => el.tagName?.toLowerCase() === 'va-file-input',
    );

    // every <va-file-input> lives in the COMPONENT’S shadow-root
    const fileInputs = Array.from(
      fileInputRef.current.shadowRoot.querySelectorAll('va-file-input'),
    );

    const idx = fileInputs.indexOf(vaFileInputEl); // 0-based, matches files[]

    setMeta(prev => ({ ...prev, [idx]: e.detail.value }));
  };

  /* ---------- 3. submit ---------- */
  const handleSubmit = () => {
    const payload = files.map((f, i) => ({
      file: f.file,
      fileTypeId: meta[i], // ← now defined!
      password: f.password ?? '',
    }));
    console.log('payload', payload);
    // TODO: send to API
  };

  return (
    <>
      <VaFileInputMultiple
        ref={fileInputRef}
        label="Select a file to upload"
        name="my-file-input"
        hint="You can upload a .pdf, .gif, .jpg, .bmp, or .txt file."
        onVaMultipleChange={handleFiles}
        onVaSelect={handleSelect} // <-- single bubbling listener
      >
        {/* cloned into every file-picker card */}
        <VaSelect label="What kind of file is this?" name="fileType" required>
          <option value="1">Public Document</option>
          <option value="2">Private Document</option>
        </VaSelect>
      </VaFileInputMultiple>

      <va-button text="Submit files" onClick={handleSubmit} />
    </>
  );
}
