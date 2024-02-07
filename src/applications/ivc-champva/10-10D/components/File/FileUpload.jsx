import React, { useState } from 'react';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  VaFileInput,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getFileSize } from '../../helpers/utilities';

/*
Custom file upload component. Main difference from standard file upload (other 
than custom layout) is that this does not make an backend call on upload.
Main use for this is so we can have something in place for user testing 
while backend details are still being ironed out. Then this can be rewired or
removed as backend come online.
*/

function FileFieldCustom({
  data,
  setFormData,
  goBack,
  goForward,
  contentBeforeButtons,
  contentAfterButtons,
}) {
  const [attachments, setAttachments] = useState(
    data?.supportingDocuments || [],
  );

  const onAddFile = async event => {
    const { files } = event.detail;
    setAttachments([...attachments, ...files]);
  };

  const onRemoveFile = fileToRemoveName => {
    setAttachments(attachments.filter(file => file.name !== fileToRemoveName));
  };

  const handlers = {
    onGoForward: event => {
      event.preventDefault();
      setFormData({ ...data, supportingDocuments: attachments });
      goForward(data);
    },
  };

  const fileTypes = ['png', 'heic', 'pdf', 'jpg', 'jpeg'];

  return (
    <>
      <>
        <VaFileInput
          id="add-supporting-doc"
          name="add-supporting-doc"
          accept={fileTypes}
          button-text="Upload Supporting Doc"
          data-testid="ask-va-file-upload-button"
          hint={`You can upload ${fileTypes
            .slice(0, -1)
            .join(', ')}, and ${fileTypes.slice(-1)} files`}
          label="Upload supporting documents"
          onVaChange={onAddFile}
          uswds
        />
        <h3 className="site-preview-heading">Attachments</h3>
        {attachments.length > 0 ? (
          <ul className="attachments-list">
            {attachments.map(file => (
              <li key={file.name + file.size}>
                <div className="attachment-file">
                  <span>
                    <i
                      className="fas fa-paperclip"
                      alt="Attachment icon"
                      aria-hidden="true"
                    />
                    <span className="vads-u-margin-left--1">{file.name}</span> (
                    {getFileSize(file.size)})
                  </span>
                  <VaButton
                    onClick={() => onRemoveFile(file.name)}
                    secondary
                    text="Remove"
                    uswds
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-attachments">There are no attachments.</div>
        )}

        <div className="vads-u-margin-top--4">
          {contentBeforeButtons}
          <FormNavButtons goBack={goBack} goForward={handlers.onGoForward} />
          {contentAfterButtons}
        </div>
      </>
    </>
  );
}

export default FileFieldCustom;
