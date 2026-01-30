import PropTypes from 'prop-types';
import React from 'react';
import { isBefore, parseISO } from 'date-fns';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  formatDescription,
  buildDateFormatter,
  getDisplayFriendlyName,
  getIsSensitive,
  getIsDBQ,
  getNoActionNeeded,
} from '../../utils/helpers';
import AddFilesForm from '../claim-files-tab/AddFilesForm';
import Notification from '../Notification';
import Type1UnknownUploadError from '../Type1UnknownUploadError';
import { focusNotificationAlert } from '../../utils/page';
import { evidenceDictionary } from '../../utils/evidenceDictionary';

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

  const frontendContentOverride = evidenceDictionary[item.displayName];
  const frontendDescription = frontendContentOverride?.longDescription;
  const frontendNextSteps = frontendContentOverride?.nextSteps;

  const isSensitive = getIsSensitive(item);
  const isDBQ = getIsDBQ(item);
  const noActionNeeded = getNoActionNeeded(item);

  const apiDescription = formatDescription(item.description);
  const isFirstParty = item.status === 'NEEDED_FROM_YOU';
  const isThirdParty = item.status === 'NEEDED_FROM_OTHERS';

  const getItemDisplayName = () => {
    if (isDBQ) {
      return 'Request for an exam';
    }
    if (item.friendlyName) {
      return `Your ${getDisplayFriendlyName(item)}`;
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
      )} for: ${getDisplayFriendlyName(item)}`;
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
        item.friendlyName ? getDisplayFriendlyName(item) : item.displayName
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
        (pastDueDate ? (
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
        ) : (
          !item.friendlyName && (
            <div className="vads-u-margin-top--4 vads-u-margin-bottom--2">
              <p>
                We requested this evidence from you on{' '}
                {dateFormatter(item.requestedDate)}. You can still send the
                evidence after the “respond by” date, but it may delay your
                claim.
              </p>
            </div>
          )
        ))}

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

      {frontendDescription && (
        <div
          className="vads-u-margin-bottom--4"
          data-testid="frontend-description"
        >
          {frontendDescription}
        </div>
      )}
      {!frontendDescription &&
        apiDescription && (
          <div
            className="vads-u-margin-bottom--4"
            data-testid="api-description"
          >
            {apiDescription}
          </div>
        )}
      {isFirstParty &&
        !frontendDescription &&
        !apiDescription && (
          <div
            className="vads-u-margin-bottom--4"
            data-testid="empty-state-description"
          >
            <p>
              We’re unable to provide more information about the request on this
              page. To learn more about it, review your claim letter.
            </p>
            <VaLink
              text="Access your claim letters"
              label="Access your claim letters"
              href="/track-claims/your-claim-letters"
            />
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
        frontendContentOverride && (
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

      {/* Custom next steps from dictionary */}
      {frontendNextSteps && (
        <div className="vads-u-margin-y--4">
          <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Next steps
          </h2>
          <div data-testid="frontend-next-steps">{frontendNextSteps}</div>
        </div>
      )}

      {/* Generic next steps for first-party requests without custom next steps */}
      {!frontendNextSteps &&
        isFirstParty && (
          <div className="vads-u-margin-y--4">
            <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
              Next steps
            </h2>
            <p>To respond to this request:</p>
            <ul className="bullet-disc">
              {frontendDescription || apiDescription ? (
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
            {(frontendDescription || apiDescription) && (
              <p>
                If you need help understanding this request, check your claim
                letter online.
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
