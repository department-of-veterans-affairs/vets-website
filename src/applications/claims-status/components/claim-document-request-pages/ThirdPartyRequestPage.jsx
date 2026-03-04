import PropTypes from 'prop-types';
import React from 'react';
import { buildDateFormatter } from '../../utils/helpers';
import * as TrackedItem from '../../utils/trackedItemContent';
import AddFilesForm from '../claim-files-tab/AddFilesForm';
import { resolveSharedContent } from './shared/descriptionContent';
import RequestNotifications from './shared/RequestNotifications';

export default function ThirdPartyRequestPage({
  item,
  onCancel,
  onSubmit,
  progress,
  uploading,
  message,
  type1UnknownErrors,
}) {
  const dateFormatter = buildDateFormatter();

  const isDBQ = TrackedItem.getIsDBQ(item);
  const noActionNeeded = TrackedItem.getNoActionNeeded(item);

  const {
    longDescriptionContent,
    longDescriptionTestId,
    nextStepsContent,
  } = resolveSharedContent(item);

  const getDisplayName = () => {
    if (isDBQ) {
      return 'Request for an exam';
    }
    if (item.friendlyName) {
      return `Your ${TrackedItem.getDisplayFriendlyName(item)}`;
    }
    return 'Request for evidence outside VA';
  };

  const getRequestText = () => {
    if (isDBQ) {
      return `We made a request on ${dateFormatter(item.requestedDate)} for: ${
        item.friendlyName
          ? TrackedItem.getDisplayFriendlyName(item)
          : item.displayName
      }`;
    }
    if (item.friendlyName) {
      return `We made a request outside VA on ${dateFormatter(
        item.requestedDate,
      )}`;
    }
    return `We made a request outside VA on ${dateFormatter(
      item.requestedDate,
    )} for: ${item.displayName}`;
  };

  return (
    <div id="default-page" className="vads-u-margin-bottom--3">
      <div className="vads-u-margin-bottom--4">
        <h1 className="claims-header">
          {getDisplayName()}
          <span className="vads-u-font-family--sans vads-u-margin-top--1">
            {getRequestText()}
          </span>
        </h1>
      </div>
      <RequestNotifications
        message={message}
        type1UnknownErrors={type1UnknownErrors}
      />

      <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--2">
        What we’re notifying you about
      </h2>

      {longDescriptionContent && (
        <div
          className="vads-u-margin-bottom--4"
          data-testid={longDescriptionTestId}
        >
          {longDescriptionContent}
        </div>
      )}

      <div className="optional-upload">
        <p className="vads-u-margin-y--2">
          <strong>This is just a notice. No action is needed by you.</strong>
          {!noActionNeeded && (
            <>
              {' '}
              But, if you have documents related to this request, uploading them
              on this page may help speed up the evidence review for your claim.
            </>
          )}
        </p>
      </div>

      {nextStepsContent && (
        <div className="vads-u-margin-y--4">
          <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Next steps
          </h2>
          {nextStepsContent}
        </div>
      )}

      {item.canUploadFile && (
        <AddFilesForm
          progress={progress}
          uploading={uploading}
          onCancel={onCancel}
          onSubmit={files => onSubmit(files)}
        />
      )}
    </div>
  );
}

ThirdPartyRequestPage.propTypes = {
  item: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  message: PropTypes.object,
  progress: PropTypes.number,
  type1UnknownErrors: PropTypes.array,
  uploading: PropTypes.bool,
};
