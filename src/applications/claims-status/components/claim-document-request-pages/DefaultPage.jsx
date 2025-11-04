import PropTypes from 'prop-types';
import React from 'react';
import { isBefore, parseISO } from 'date-fns';
import {
  scrubDescription,
  buildDateFormatter,
  getDisplayFriendlyName,
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
  const getItemDisplayName = () => {
    if (item.displayName.toLowerCase().includes('dbq')) {
      return 'Request for an exam';
    }
    if (item.friendlyName) {
      return `Your ${getDisplayFriendlyName(item)}`;
    }
    return 'Request for evidence outside VA';
  };
  const getFirstPartyDisplayName = () => {
    if (evidenceDictionary[item.displayName]?.isSensitive) {
      return `Request for evidence`;
    }
    return item.friendlyName || 'Request for evidence';
  };
  const getFirstParyRequestText = () => {
    if (
      item.friendlyName &&
      evidenceDictionary[item.displayName]?.isSensitive
    ) {
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
    if (evidenceDictionary[item.displayName]?.isDBQ) {
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
      <h1 className="claims-header">
        {item.status === 'NEEDED_FROM_YOU' ? (
          <>
            {getFirstPartyDisplayName()}
            <span className="vads-u-font-family--sans vads-u-margin-bottom--1 vads-u-margin-top--1">
              {getFirstParyRequestText()}
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
      {/* Only show errors in DefaultPage when feature flag is ON */}
      {/* For type 1 known errors, display an alert */}
      {message && (
        <div className="vads-u-margin-top--0">
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
              type="error"
              onSetFocus={!message ? focusNotificationAlert : undefined}
            />
          </div>
        )}
      {item.status === 'NEEDED_FROM_YOU' &&
        (pastDueDate ? (
          <va-alert status="warning" class="vads-u-margin-top--4">
            <h2 slot="headline">Deadline passed for requested information</h2>
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
            <p>
              We requested this evidence from you on{' '}
              {dateFormatter(item.requestedDate)}. You can still send the
              evidence after the “respond by” date, but it may delay your claim.
            </p>
          )
        ))}
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
            <strong>This is just a notice. No action is needed by you.</strong>
            {(!evidenceDictionary[item.displayName] ||
              !evidenceDictionary[item.displayName].noActionNeeded) && (
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

      {item.status === 'NEEDED_FROM_YOU' &&
        evidenceDictionary[item.displayName] && (
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
      {!evidenceDictionary[item.displayName]?.nextSteps &&
        item.status === 'NEEDED_FROM_YOU' && (
          <>
            <h2>Next steps</h2>
            <p>To respond to this request:</p>
            <ul className="bullet-disc">
              <li>
                Gather and submit any documents or forms listed in the{' '}
                <strong>What we need from you</strong> section.
              </li>
              <li>You can upload documents online or mail them to us.</li>
            </ul>
            <p>
              If you need help understanding this request, check your claim
              letter online.
              <br />
              <va-link
                text="Your claim letters"
                label="Your claim letters"
                href="/track-claims/your-claim-letters"
              />
            </p>
            <p>
              You can find blank copies of many VA forms online.
              <br />
              <va-link
                active
                text="Find a VA form"
                label="Find a VA form"
                href="/find-forms"
              />
            </p>
          </>
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
