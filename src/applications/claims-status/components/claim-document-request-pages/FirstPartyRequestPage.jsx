import PropTypes from 'prop-types';
import React from 'react';
import { isBefore, parseISO } from 'date-fns';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { buildDateFormatter } from '../../utils/helpers';
import * as TrackedItem from '../../utils/trackedItemContent';
import AddFilesForm from '../claim-files-tab/AddFilesForm';
import { resolveSharedContent } from './shared/descriptionContent';
import RequestNotifications from './shared/RequestNotifications';

export default function FirstPartyRequestPage({
  item,
  onCancel,
  onSubmit,
  progress,
  uploading,
  message,
  type1UnknownErrors,
}) {
  const dateFormatter = buildDateFormatter();
  const now = new Date();
  const dueDate = parseISO(item.suspenseDate);
  const pastDueDate = isBefore(dueDate, now);

  const isSensitive = TrackedItem.getIsSensitive(item);

  const {
    longDescriptionContent: sharedLongDescription,
    longDescriptionTestId: sharedLongDescriptionTestId,
    nextStepsContent: sharedNextSteps,
    hasDescriptionContent,
  } = resolveSharedContent(item);

  const getDisplayName = () => {
    if (isSensitive) {
      return `Request for evidence`;
    }
    return item.friendlyName || 'Request for evidence';
  };

  const getRequestText = () => {
    if (item.friendlyName && isSensitive) {
      return `Respond by ${dateFormatter(
        item.suspenseDate,
      )} for: ${TrackedItem.getDisplayFriendlyName(item)}`;
    }
    if (item.friendlyName) {
      return `Respond by ${dateFormatter(item.suspenseDate)}`;
    }
    return `Respond by ${dateFormatter(item.suspenseDate)} for: ${
      item.displayName
    }`;
  };

  // Handle first-party fallback for longDescription (empty state)
  let longDescriptionContent = sharedLongDescription;
  let longDescriptionTestId = sharedLongDescriptionTestId;

  if (!longDescriptionContent) {
    longDescriptionContent = (
      <>
        <p>
          We’re unable to provide more information about the request on this
          page. To learn more about it, review your claim letter.
        </p>
        <VaLink
          text="Access your claim letters"
          label="Access your claim letters"
          href="/track-claims/your-claim-letters"
        />
      </>
    );
    longDescriptionTestId = 'empty-state-description';
  }

  // Handle first-party fallback for nextSteps (generic instructions)
  let nextStepsContent = sharedNextSteps;

  if (!nextStepsContent) {
    nextStepsContent = (
      <>
        <p>To respond to this request:</p>
        <ul className="bullet-disc">
          {hasDescriptionContent ? (
            <li data-testid="next-steps-in-what-we-need-from-you">
              Gather and submit any documents or forms listed in the{' '}
              <strong>What we need from you</strong> section
            </li>
          ) : (
            <li data-testid="next-steps-in-claim-letter">
              Gather and submit any documents or forms listed in the claim
              letter
            </li>
          )}
          <li>You can upload documents online or mail them to us</li>
        </ul>
        {hasDescriptionContent && (
          <p>
            If you need help understanding this request, check your claim letter
            online.
            <br />
            <VaLink
              text="Access your claim letters"
              label="Access your claim letters"
              href="/track-claims/your-claim-letters"
            />
          </p>
        )}
        <p>
          You can find blank copies of many VA forms online.
          <br />
          <VaLink
            text="Find a VA form"
            label="Find a VA form"
            href="/find-forms"
          />
        </p>
      </>
    );
  }

  return (
    <div id="default-page" className="vads-u-margin-bottom--3">
      <div className="vads-u-margin-bottom--4">
        <h1 className="claims-header">
          {getDisplayName()}
          <span className="vads-u-font-family--sans vads-u-margin-top--0p5">
            {getRequestText()}
          </span>
        </h1>
      </div>
      <RequestNotifications
        message={message}
        type1UnknownErrors={type1UnknownErrors}
      />
      {pastDueDate && (
        <va-alert status="warning" class="vads-u-margin-y--4">
          <h2
            slot="headline"
            className="vads-u-margin-top--0 vads-u-margin-bottom--2"
          >
            Deadline passed for requested information
          </h2>
          <p className="vads-u-margin-y--0">
            We haven’t received the information we asked for. You can still send
            it, but we may review your claim without it.
          </p>
          <p>
            If you have questions, call the VA benefits hotline at{' '}
            <va-telephone contact="8008271000" /> (
            <va-telephone contact="711" tty="true" />
            ).
          </p>
        </va-alert>
      )}
      <div className="vads-u-margin-top--4 vads-u-margin-bottom--2">
        <p>
          We requested this evidence from you on{' '}
          {dateFormatter(item.requestedDate)}. You can still send the evidence
          after the “respond by” date, but it may delay your claim.
        </p>
      </div>

      <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--2">
        What we need from you
      </h2>

      {longDescriptionContent && (
        <div
          className="vads-u-margin-bottom--4"
          data-testid={longDescriptionTestId}
        >
          {longDescriptionContent}
        </div>
      )}

      {hasDescriptionContent && (
        <div
          className="vads-u-margin-y--4"
          data-testid="learn-about-request-section"
        >
          <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Learn about this request in your claim letter
          </h3>
          <p className="vads-u-margin-y--2">
            On {dateFormatter(item.requestedDate)}, we mailed you a letter
            titled "Request for Specific Evidence or Information," which may
            include more details about this request.
          </p>
          <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
            You can access this and all your claim letters online.
          </p>
          <VaLink
            text="Access your claim letters"
            label="Access your claim letters"
            href="/track-claims/your-claim-letters"
          />
        </div>
      )}

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

FirstPartyRequestPage.propTypes = {
  item: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  message: PropTypes.object,
  progress: PropTypes.number,
  type1UnknownErrors: PropTypes.array,
  uploading: PropTypes.bool,
};
