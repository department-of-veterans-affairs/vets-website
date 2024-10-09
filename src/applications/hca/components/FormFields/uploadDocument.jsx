import React, { useState } from 'react';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch } from 'react-redux';
import { uploadAttachment } from '../../utils/actions/upload-document';

export const UploadDocument = () => {
  const [errorsList, setErrorsList] = useState([]);
  const dispatch = useDispatch();

  async function handleChange(event) {
    const errors = await Promise.all(
      event.detail.files.map(async (file, index) => {
        // const attachmentsSelector = document
        //   .getElementsByName('my-file-input')[0]
        //   .shadowRoot.querySelectorAll('.hydrated');
        // const attachmentList = Array.from(attachmentsSelector).map(input => {
        //   return {
        //     index,
        //     uploaded: !!input.shadowRoot.querySelector('.va-card'),
        //   };
        // });

        // if (!attachmentList[index].uploaded) {
        const response = await dispatch(uploadAttachment(file));
        return response.error ? `${index} ${response.error.detail}` : null;
        // } else {
        //   return null;
        // }
      }),
    );

    setErrorsList(errors);
  }

  return (
    <VaFileInputMultiple
      uswds
      accept=".pdf, .doc, .docx, .jpg, .jpeg, .rtf, .png"
      errors={errorsList}
      header-size={3}
      hint="You can upload a .pdf, .gif, .jpg, .bmp, or .txt file."
      label="Header label"
      name="my-file-input"
      onVaMultipleChange={handleChange}
      required
    />
  );
};
