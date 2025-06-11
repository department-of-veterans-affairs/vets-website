import PropTypes from 'prop-types';
import React from 'react';
import { Toggler } from '~/platform/utilities/feature-toggles';
import {
  scrubDescription,
  buildDateFormatter,
  getDisplayFriendlyName,
} from '../../utils/helpers';
import AddFilesForm from '../claim-files-tab/AddFilesForm';
import DueDate from '../DueDate';
import { evidenceDictionary } from '../../utils/evidenceDictionary';

export default function DefaultPage({
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
  const dateFormatter = buildDateFormatter();

  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.cstFriendlyEvidenceRequests}>
      <Toggler.Enabled>
        <div id="default-page" className="vads-u-margin-bottom--3">
          <h1 className="claims-header">
            {item.status === 'NEEDED_FROM_YOU' ? (
              <>
                {item.friendlyName || item.displayName}
                <span className="vads-u-font-family--sans vads-u-margin-bottom--1 vads-u-margin-top--1">
                  Respond by {dateFormatter(item.suspenseDate)}
                  <DueDate date={item.suspenseDate} />
                </span>
              </>
            ) : (
              <>
                {item.friendlyName
                  ? `Your ${getDisplayFriendlyName(item)}`
                  : item.displayName}
                <span className="vads-u-font-family--sans vads-u-margin-top--1">
                  {evidenceDictionary[item.displayName] &&
                  evidenceDictionary[item.displayName].isDBQ
                    ? `Requested from examiner's office on`
                    : 'Requested from outside VA on'}{' '}
                  {dateFormatter(item.requestedDate)}
                </span>
              </>
            )}
          </h1>

          {item.status === 'NEEDED_FROM_YOU' ? (
            <h2>What we need from you</h2>
          ) : (
            <h2>What we’re notifying you about</h2>
          )}

          {evidenceDictionary[item.displayName] ? (
            evidenceDictionary[item.displayName].longDescription
          ) : (
            <p>{scrubDescription(item.description)}</p>
          )}

          {item.status === 'NEEDED_FROM_OTHERS' && (
            <div className="optional-upload">
              <p>
                <strong>
                  This is just a notice. No action is needed by you.
                </strong>
                {(!evidenceDictionary[item.displayName] ||
                  !evidenceDictionary[item.displayName].noActionNeeded) && (
                  <>
                    {' '}
                    But, if you have documents related to this request,
                    uploading them on this page may help speed up the evidence
                    review for your claim.
                  </>
                )}
              </p>
            </div>
          )}

          {item.status === 'NEEDED_FROM_YOU' && (
            <>
              <h3>Learn about this request in your claim letter</h3>
              <p>
                On {dateFormatter(item.requestedDate)}, we mailed you a letter
                titled “Request for Specific Evidence or Information,” which may
                include more details about this request. You can access this and
                all your claim letters online.
                <br />
                <va-link
                  text="Your claim letters"
                  label="Your claim letters"
                  href="/track-claims/your-claim-letters"
                />
              </p>
            </>
          )}
          {evidenceDictionary[item.displayName] &&
            evidenceDictionary[item.displayName].nextSteps && (
              <>
                <h2>Next steps</h2>
                {evidenceDictionary[item.displayName].nextSteps}
              </>
            )}
          {item.canUploadFile && (
            <AddFilesForm
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
          )}
        </div>
      </Toggler.Enabled>
      <Toggler.Disabled>
        <div id="default-page" className="vads-u-margin-bottom--3">
          <h1 className="claims-header">{item.displayName}</h1>
          {item.status === 'NEEDED_FROM_YOU' ? (
            <DueDate date={item.suspenseDate} />
          ) : null}
          {item.status === 'NEEDED_FROM_OTHERS' ? (
            <div className="optional-upload">
              <p>
                <strong>Optional</strong> - We’ve asked others to send this to
                us, but you may upload it if you have it.
              </p>
            </div>
          ) : null}
          <p>{scrubDescription(item.description)}</p>
          <AddFilesForm
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
      </Toggler.Disabled>
    </Toggler>
  );
}

DefaultPage.propTypes = {
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
