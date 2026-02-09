import PropTypes from 'prop-types';
import React from 'react';
import { isBefore, parseISO } from 'date-fns';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { buildDateFormatter } from '../../utils/helpers';
import * as TrackedItem from '../../utils/trackedItemContent';
import AddFilesForm from '../claim-files-tab/AddFilesForm';
import Notification from '../Notification';
import Type1UnknownUploadError from '../Type1UnknownUploadError';
import { focusNotificationAlert } from '../../utils/page';
import { evidenceDictionary } from '../../utils/evidenceDictionary';
import { TrackedItemContent } from '../TrackedItemContent';

export default function DefaultPage({
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

  // Priority 1: API-provided structured content (JSON blocks → TrackedItemContent)
  const apiLongDescription = item.longDescription?.blocks;
  const apiNextSteps = item.nextSteps?.blocks;

  // Priority 2: Frontend dictionary JSX (legacy fallback during migration)
  const frontendContentOverride = evidenceDictionary[item.displayName];
  const frontendDescription = frontendContentOverride?.longDescription;
  const frontendNextSteps = frontendContentOverride?.nextSteps;

  // Priority 3: Simple API description (plain text with formatting markers)
  const apiDescription = TrackedItem.formatDescription(item.description);

  const hasDescriptionContent =
    apiLongDescription || frontendDescription || apiDescription;

  // Use API boolean properties with fallback to evidenceDictionary
  const isSensitive = TrackedItem.getIsSensitive(item);
  const isDBQ = TrackedItem.getIsDBQ(item);
  const noActionNeeded = TrackedItem.getNoActionNeeded(item);

  const isFirstParty = item.status === 'NEEDED_FROM_YOU';
  const isThirdParty = item.status === 'NEEDED_FROM_OTHERS';

  const getItemDisplayName = () => {
    if (isDBQ) {
      return 'Request for an exam';
    }
    if (item.friendlyName) {
      return `Your ${TrackedItem.getDisplayFriendlyName(item)}`;
    }
    return 'Request for evidence outside VA';
  };
  const getFirstPartyDisplayName = () => {
    if (isSensitive) {
      return `Request for evidence`;
    }
    return item.friendlyName || 'Request for evidence';
  };
  const getFirstPartyRequestText = () => {
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

  // Determine longDescription content (Priority 1: API → Priority 2: Frontend → Priority 3: Simple API → Fallback: Empty state)
  let longDescriptionContent = null;
  let longDescriptionTestId = null;

  if (apiLongDescription) {
    // Priority 1: API-provided structured content
    longDescriptionContent = (
      <TrackedItemContent content={apiLongDescription} />
    );
    longDescriptionTestId = 'api-long-description';
  } else if (frontendDescription) {
    longDescriptionContent = frontendDescription;
    longDescriptionTestId = 'frontend-description';
  } else if (apiDescription) {
    // Priority 3: Simple API description
    longDescriptionContent = apiDescription;
    longDescriptionTestId = 'api-description';
  } else if (isFirstParty) {
    // Fallback: Empty state
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

  // Determine nextSteps content (Priority 1: API → Priority 2: Frontend → Fallback: Empty state)
  let nextStepsContent = null;

  if (apiNextSteps) {
    // Priority 1: API-provided structured content
    nextStepsContent = (
      <div data-testid="api-next-steps">
        <TrackedItemContent content={apiNextSteps} />
      </div>
    );
  } else if (frontendNextSteps) {
    // Priority 2: Frontend dictionary JSX
    nextStepsContent = (
      <div data-testid="frontend-next-steps">{frontendNextSteps}</div>
    );
  } else if (isFirstParty) {
    // Fallback: Empty state
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
          {isFirstParty ? (
            <>
              {getFirstPartyDisplayName()}
              <span className="vads-u-font-family--sans vads-u-margin-top--0p5">
                {getFirstPartyRequestText()}
              </span>
            </>
          ) : (
            <>
              {getItemDisplayName()}
              <span className="vads-u-font-family--sans vads-u-margin-top--1">
                {getRequestText()}
              </span>
            </>
          )}
        </h1>
      </div>
      {/* Only show errors in DefaultPage when feature flag is ON */}
      {/* For type 1 known errors, display an alert */}
      {message && (
        <div className="vads-u-margin-y--4">
          <Notification
            title={message.title}
            body={message.body}
            type={message.type}
            onSetFocus={focusNotificationAlert}
          />
        </div>
      )}
      {/* For type 1 unknown errors, display the Type 1 Unknown Upload Error alert */}
      {type1UnknownErrors &&
        type1UnknownErrors.length > 0 && (
          <div className="vads-u-margin-y--4">
            <Notification
              title="We need you to submit files by mail or in person"
              body={<Type1UnknownUploadError errorFiles={type1UnknownErrors} />}
              role="alert"
              type="error"
              onSetFocus={!message ? focusNotificationAlert : undefined}
            />
          </div>
        )}
      {isFirstParty &&
        pastDueDate && (
          <va-alert status="warning" class="vads-u-margin-y--4">
            <h2
              slot="headline"
              className="vads-u-margin-top--0 vads-u-margin-bottom--2"
            >
              Deadline passed for requested information
            </h2>
            <p className="vads-u-margin-y--0">
              We haven’t received the information we asked for. You can still
              send it, but we may review your claim without it.
            </p>
            <p>
              If you have questions, call the VA benefits hotline at{' '}
              <va-telephone contact="8008271000" /> (
              <va-telephone contact="711" tty="true" />
              ).
            </p>
          </va-alert>
        )}
      {isFirstParty && (
        <div className="vads-u-margin-top--4 vads-u-margin-bottom--2">
          <p>
            We requested this evidence from you on{' '}
            {dateFormatter(item.requestedDate)}. You can still send the evidence
            after the “respond by” date, but it may delay your claim.
          </p>
        </div>
      )}

      {/* What we need from you or What we’re notifying you about section */}
      {isFirstParty ? (
        <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--2">
          What we need from you
        </h2>
      ) : (
        <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--2">
          What we’re notifying you about
        </h2>
      )}

      {/* Display the longDescription content */}
      {longDescriptionContent && (
        <div
          className="vads-u-margin-bottom--4"
          data-testid={longDescriptionTestId}
        >
          {longDescriptionContent}
        </div>
      )}

      {isThirdParty && (
        <div className="optional-upload">
          <p className="vads-u-margin-y--2">
            <strong>This is just a notice. No action is needed by you.</strong>
            {!noActionNeeded && (
              <>
                {' '}
                But, if you have documents related to this request, uploading
                them on this page may help speed up the evidence review for your
                claim.
              </>
            )}
          </p>
        </div>
      )}

      {isFirstParty &&
        hasDescriptionContent && (
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

      {/* Display the nextSteps content */}
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

DefaultPage.propTypes = {
  item: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  message: PropTypes.object,
  progress: PropTypes.number,
  type1UnknownErrors: PropTypes.array,
  uploading: PropTypes.bool,
};
