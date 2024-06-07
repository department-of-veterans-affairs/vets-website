import PropTypes from 'prop-types';
import React from 'react';
import { scrubDescription } from '../../utils/helpers';

import DueDate from '../DueDate';
import AddFilesFormOld from '../AddFilesFormOld';

function DefaultDocumentRequestPage({
  field,
  files,
  item,
  onAddFile,
  onCancel,
  onDirtyFields,
  onFieldChange,
  onRemoveFile,
  onSubmit,
  backUrl,
  progress,
  uploading,
}) {
  return (
    <div id="default-document-request-page">
      <h1 className="claims-header">{item.displayName}</h1>
      {item.status === 'NEEDED_FROM_YOU' ? (
        <DueDate date={item.suspenseDate} />
      ) : null}
      {item.status === 'NEEDED_FROM_OTHERS' ? (
        <div className="optional-upload">
          <p>
            <strong>Optional</strong> - We’ve asked others to send this to us,
            but you may upload it if you have it.
          </p>
        </div>
      ) : null}
      <p>{scrubDescription(item.description)}</p>
      <AddFilesFormOld
        field={field}
        progress={progress}
        uploading={uploading}
        files={files}
        backUrl={backUrl}
        onSubmit={onSubmit}
        onAddFile={onAddFile}
        onRemoveFile={onRemoveFile}
        onFieldChange={onFieldChange}
        onCancel={onCancel}
        onDirtyFields={onDirtyFields}
      />
    </div>
  );
}

DefaultDocumentRequestPage.propTypes = {
  field: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
  onAddFile: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDirtyFields: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  backUrl: PropTypes.string,
  progress: PropTypes.number,
  uploading: PropTypes.bool,
};

export default DefaultDocumentRequestPage;
