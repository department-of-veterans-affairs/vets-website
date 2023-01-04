import React from 'react';
import { Link } from 'react-router';

import { content } from './evidenceSummary';
import { content as limitContent } from './evidencePrivateLimitation';
import { readableList } from '../utils/helpers';
import { getDate } from '../utils/dates';

import {
  FORMAT_COMPACT,
  EVIDENCE_VA_PATH,
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_LIMITATION_PATH,
  EVIDENCE_UPLOAD_PATH,
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
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const buildVaContent = ({
  vaEvidence,
  reviewMode = false,
  handlers = {},
  testing,
}) => (
  <>
    <h3 className="vads-u-font-size--h3">{content.vaTitle}</h3>
    <ul className="evidence-summary">
      {vaEvidence.map((location, index) => {
        const { locationAndName, issues, evidenceDates = {} } = location || {};
        const path = `/${EVIDENCE_VA_PATH}?index=${index}`;
        return (
          <li key={locationAndName + index} className={listClassNames}>
            {!reviewMode && (
              <Link
                className="float-right edit-item"
                to={path}
                aria-label={`${content.edit} ${locationAndName}`}
                data-link={testing ? path : null}
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
                class="vads-u-display--block remove-item"
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
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const buildPrivateContent = ({
  privateEvidence,
  limitedConsent = '',
  reviewMode = false,
  handlers = {},
  testing,
}) => (
  <>
    <h3 className="vads-u-font-size--h3">{content.privateTitle}</h3>
    <ul className="evidence-summary">
      {privateEvidence.map((facility, index) => {
        const { providerFacilityName, issues, treatmentDateRange = {} } =
          facility || {};
        const path = `/${EVIDENCE_PRIVATE_PATH}?index=${index}`;
        return (
          <li key={providerFacilityName + index} className={listClassNames}>
            {!reviewMode && (
              <Link
                className="float-right edit-item"
                to={path}
                aria-label={`${content.edit} ${providerFacilityName}`}
                data-link={testing ? path : null}
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
                class="vads-u-display--block remove-item"
                label={`${content.remove} ${providerFacilityName}`}
                text={content.remove}
                secondary
              />
            )}
          </li>
        );
      })}
      <li className={listClassNames}>
        {!reviewMode && (
          <Link
            className="float-right edit-item"
            to={`/${EVIDENCE_LIMITATION_PATH}`}
            aria-label={`${content.edit} ${limitContent.name} `}
            data-link={testing ? EVIDENCE_LIMITATION_PATH : null}
          >
            {content.edit}
          </Link>
        )}
        <div>{limitContent.title}</div>
        <strong>
          {limitContent.review[limitedConsent.length ? 'y' : 'n']}
        </strong>
        {!reviewMode && limitedConsent.length ? (
          <va-button
            onClick={handlers.removePrivateLimitation}
            class="vads-u-display--block remove-item"
            label={`${content.remove} ${limitContent.name}`}
            text={content.remove}
            secondary
          />
        ) : null}
      </li>
    </ul>
  </>
);

/**
 * Build uploaded evidence list
 * @param {Object[]} otherEvidence - Uploaded evidence array
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Object} handlers - Event callback functions for links & buttons
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const buildUploadContent = ({
  otherEvidence,
  reviewMode = false,
  handlers = {},
  testing,
}) => (
  <>
    <h3 className="vads-u-font-size--h3">{content.otherTitle}</h3>
    <p>We’ll submit the below supporting evidence you uploaded:</p>
    <ul className="evidence-summary">
      {otherEvidence.map((upload, index) => (
        <li key={upload.name} className={listClassNames}>
          {!reviewMode && (
            <Link
              className="float-right edit-item"
              to={`/${EVIDENCE_UPLOAD_PATH}`}
              aria-label={`${content.edit} ${upload.name}`}
              data-link={testing ? EVIDENCE_UPLOAD_PATH : null}
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
              class="vads-u-display--block remove-item"
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
