import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { content } from '../content/evidenceSummary';
import { content as limitContent } from '../content/evidencePrivateLimitation';
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
 * Changing header levels :(
 * @param {Boolean} onReviewPage - only passed in from EvidenceSummary
 * @param {Boolean} reviewMode - only passed in from EvidenceSummaryReview, and
 *  true when the review & submit page is not in edit mode
 * @returns {String} H-tag
 * Review & submit pages are nested inside an accordion, so we increase levels
 * by one, but when edit mode (opposite of reviewMode) is entered, the page
 * header (h4) disappears, so we match the other page header levels
 */
const getHeaderLevel = ({ onReviewPage, reviewMode }) =>
  onReviewPage || reviewMode ? 'h5' : 'h3';

/**
 * Build VA evidence list
 * @param {Object[]} vaEvidence - VA evidence array
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Object} handlers - Event callback functions for links & buttons
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const VaContent = ({
  list = [],
  reviewMode = false,
  onReviewPage,
  handlers = {},
  testing,
}) => {
  const Header = getHeaderLevel({ onReviewPage, reviewMode });
  return list?.length ? (
    <>
      <Header className="vads-u-font-size--h3">{content.vaTitle}</Header>
      <ul className="evidence-summary">
        {list.map((location, index) => {
          const { locationAndName, issues, evidenceDates = {} } =
            location || {};
          const path = `/${EVIDENCE_VA_PATH}?index=${index}`;
          return (
            <li key={locationAndName + index} className={listClassNames}>
              {!reviewMode && (
                <Link
                  key={`edit-va-${index}`}
                  id={`edit-va-${index}`}
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
  ) : null;
};

VaContent.propTypes = {
  handlers: PropTypes.shape({}),
  list: PropTypes.array,
  reviewMode: PropTypes.bool,
  testing: PropTypes.bool,
  onReviewPage: PropTypes.bool,
};

/**
 * Build private evidence list
 * @param {Object[]} privateEvidence - Private medical evidence array
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Object} handlers - Event callback functions for links & buttons
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const PrivateContent = ({
  list = [],
  limitedConsent = '',
  reviewMode = false,
  onReviewPage,
  handlers = {},
  testing,
}) => {
  const Header = getHeaderLevel({ onReviewPage, reviewMode });
  return list?.length ? (
    <>
      <Header className="vads-u-font-size--h3">{content.privateTitle}</Header>
      <ul className="evidence-summary">
        {list.map((facility, index) => {
          const { providerFacilityName, issues, treatmentDateRange = {} } =
            facility || {};
          const path = `/${EVIDENCE_PRIVATE_PATH}?index=${index}`;
          return (
            <li key={providerFacilityName + index} className={listClassNames}>
              {!reviewMode && (
                <Link
                  id={`edit-private-${index}`}
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
        <li key="limitation" className={listClassNames}>
          {!reviewMode && (
            <Link
              id="edit-limitation"
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
  ) : null;
};

PrivateContent.propTypes = {
  handlers: PropTypes.shape({}),
  limitedConsent: PropTypes.string,
  list: PropTypes.array,
  reviewMode: PropTypes.bool,
  testing: PropTypes.bool,
  onReviewPage: PropTypes.bool,
};

/**
 * Build uploaded evidence list
 * @param {Object[]} list - Uploaded evidence array
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Object} handlers - Event callback functions for links & buttons
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const UploadContent = ({
  list = [],
  reviewMode = false,
  onReviewPage,
  handlers = {},
  testing,
}) => {
  const Header = getHeaderLevel({ onReviewPage, reviewMode });
  return list?.length ? (
    <>
      <Header className="vads-u-font-size--h3">{content.otherTitle}</Header>
      <p>We’ll submit the below supporting evidence you uploaded:</p>
      <ul className="evidence-summary">
        {list.map((upload, index) => (
          <li key={upload.name + index} className={listClassNames}>
            {!reviewMode && (
              <Link
                id={`edit-upload-${index}`}
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
  ) : null;
};

UploadContent.propTypes = {
  handlers: PropTypes.shape({}),
  list: PropTypes.array,
  reviewMode: PropTypes.bool,
  testing: PropTypes.bool,
  onReviewPage: PropTypes.bool,
};
