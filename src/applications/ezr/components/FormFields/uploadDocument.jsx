import React from 'react';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch } from 'react-redux';
import { uploadAttachment } from '../../utils/actions/upload-document';

export const UploadDocument = () => {
  const dispatch = useDispatch();
  function handleChange(event) {
    dispatch(uploadAttachment(event.detail.files[0]));
  }

  return (
    <VaFileInputMultiple
      accept={null}
      error=""
      header-size={3}
      hint="You can upload a .pdf, .gif, .jpg, .bmp, or .txt file."
      label="Header label"
      name="my-file-input"
      onVaChange={handleChange}
      required
      uswds
    />
  );
};
