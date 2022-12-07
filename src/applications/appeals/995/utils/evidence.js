import React from 'react';
import { Link } from 'react-router';

import { content } from '../content/evidenceSummary';
import { readableList } from './helpers';
import { getDate } from './dates';

import {
  FORMAT_COMPACT,
  EVIDENCE_VA_PATH,
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_OTHER_PATH,
  ATTACHMENTS_OTHER,
} from '../constants';

const listClassNames = [
  'vads-u-border-top--1px',
  'vads-u-border-color--gray-light',
  'vads-u-padding-y--2',
  'vads-u-padding-x--0',
].join(' ');

const formatDateRange = ({ from, to }) => {
  const fromDate = getDate({ date: from || '', pattern: FORMAT_COMPACT });
  const toDate = getDate({ date: to || '', pattern: FORMAT_COMPACT });
  return `${fromDate}${fromDate && toDate ? ' \u2013 ' : ''}${toDate}`;
};

/**
 * Build VA evidence list
 * @param {Object[]} vaEvidence - VA evidence array
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Object} handlers - Event callback functions for links & buttons
 * @returns {JSX}
 */
export const buildVaContent = ({
  vaEvidence,
  reviewMode = false,
  handlers = {},
}) => (
  <>
    <h3 className="vads-u-font-size--h3">
      {reviewMode ? content.vaReviewTitle : content.vaTitle}
    </h3>
    <ul className="evidence-summary">
      {vaEvidence.map((location, index) => {
        const { locationAndName, issues, evidenceDates = {} } = location || {};
        return (
          <li key={locationAndName + index} className={listClassNames}>
            {!reviewMode && (
              <Link
                className="float-right"
                to={`/${EVIDENCE_VA_PATH}?index=${index}`}
                aria-label={`${content.edit} ${locationAndName}`}
              >
                {content.edit}
              </Link>
            )}
            <strong>{locationAndName}</strong>
            <div>{readableList(issues)}</div>
            {formatDateRange(evidenceDates)}
            {!reviewMode && (
              <va-button
                data-index={index}
                onClick={handlers.removeVaLocation}
                class="vads-u-display--block"
                label={`${content.remove} ${locationAndName}`}
                text={content.remove}
                secondary
              />
            )}
          </li>
        );
      })}
    </ul>
  </>
);

/**
 * Build private evidence list
 * @param {Object[]} privateEvidence - Private medical evidence array
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Object} handlers - Event callback functions for links & buttons
 * @returns {JSX}
 */
export const buildPrivateContent = ({
  privateEvidence,
  reviewMode = false,
  handlers = {},
}) => (
  <>
    <h3 className="vads-u-font-size--h3">
      {reviewMode ? content.privateReviewTitle : content.privateTitle}
    </h3>
    <ul className="evidence-summary">
      {privateEvidence.map((facility, index) => {
        const { providerFacilityName, issues, treatmentDateRange = {} } =
          facility || {};
        return (
          <li key={providerFacilityName + index} className={listClassNames}>
            {!reviewMode && (
              <Link
                className="float-right"
                to={`/${EVIDENCE_PRIVATE_PATH}?index=${index}`}
                aria-label={`${content.edit} ${providerFacilityName}`}
              >
                {content.edit}
              </Link>
            )}
            <strong>{providerFacilityName}</strong>
            <div>{readableList(issues)}</div>
            {formatDateRange(treatmentDateRange)}
            {!reviewMode && (
              <va-button
                data-index={index}
                onClick={handlers.removePrivateFacility}
                class="vads-u-display--block"
                label={`${content.remove} ${providerFacilityName}`}
                text={content.remove}
                secondary
              />
            )}
          </li>
        );
      })}
    </ul>
  </>
);

/**
 * Build uploaded evidence list
 * @param {Object[]} otherEvidence - Uploaded evidence array
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Object} handlers - Event callback functions for links & buttons
 * @returns {JSX}
 */
export const buildUploadContent = ({
  otherEvidence,
  reviewMode = false,
  handlers = {},
}) => (
  <>
    <h3 className="vads-u-font-size--h3">
      {reviewMode ? content.otherReviewTitle : content.otherTitle}
    </h3>
    <p>We’ll submit the below supporting evidence you uploaded:</p>
    <ul className="evidence-summary">
      {otherEvidence.map((upload, index) => (
        <li key={upload.name} className={listClassNames}>
          {!reviewMode && (
            <Link
              className="float-right"
              to={`/${EVIDENCE_OTHER_PATH}`}
              aria-label={`${content.edit} ${upload.name}`}
            >
              {content.edit}
            </Link>
          )}
          <strong>{upload.name}</strong>
          <div>{ATTACHMENTS_OTHER[upload.attachmentId] || ''}</div>
          {!reviewMode && (
            <va-button
              data-index={index}
              onClick={handlers.removeUpload}
              class="vads-u-display--block"
              label={`${content.remove} ${upload.name}`}
              text={content.remove}
              secondary
            />
          )}
        </li>
      ))}
    </ul>
  </>
);
