import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

import { content } from '../content/evidenceSummary';
import { content as limitContent } from '../content/evidencePrivateLimitation';
import { getDate } from '../../shared/utils/dates';

import {
  EVIDENCE_VA_PATH,
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_LIMITATION_PATH,
  EVIDENCE_UPLOAD_PATH,
  ATTACHMENTS_OTHER,
  LIMITATION_KEY,
} from '../constants';

import { FORMAT_COMPACT } from '../../shared/constants';

const listClassNames = [
  'vads-u-border-top--1px',
  'vads-u-border-color--gray-light',
  'vads-u-padding-y--2',
  'vads-u-padding-x--0',
].join(' ');

const errorClassNames = [
  'usa-input-error',
  'vads-u-padding-x--2',
  'vads-u-padding-y--0',
  'vads-u-margin-left--2',
  'vads-u-margin-top--0',
].join(' ');

const removeButtonClass = [
  'remove-item',
  'vads-u-width--auto',
  'vads-u-margin-left--2',
  'vads-u-margin-top--0',
].join(' ');

const formatDate = (date = '') => {
  const result = getDate({ date, pattern: FORMAT_COMPACT });
  return result.includes(',') ? result : '';
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

// on summary page -- titles render as h4 and evidence as h5
const getHeaderLevelH5toH4 = ({ onReviewPage, reviewMode }) =>
  onReviewPage || reviewMode ? 'h5' : 'h4';

// on review and submit page -- titles render as h5 and evidence as h6
const getHeaderLevelH6toH5 = ({ onReviewPage, reviewMode }) =>
  onReviewPage || reviewMode ? 'h6' : 'h5';
/**
 * Build VA evidence list
 * @param {Object[]} list - VA evidence array
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Boolean} onReviewPage - When true, list is rendered on review page
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
  const Header6 = getHeaderLevelH6toH5({ onReviewPage, reviewMode });
  const Header5 = getHeaderLevelH5toH4({ onReviewPage, reviewMode });
  return list?.length ? (
    <>
      <Header5>{content.vaTitle}</Header5>
      <ul className="evidence-summary">
        {list.map((location, index) => {
          const { locationAndName, issues = [], evidenceDates = {} } =
            location || {};
          const path = `/${EVIDENCE_VA_PATH}?index=${index}`;
          const fromDate = formatDate(evidenceDates.from);
          const toDate = formatDate(evidenceDates.to);
          const errors = {
            name: locationAndName ? '' : content.missing.location,
            issues: issues.length ? '' : content.missing.condition,
            from: fromDate ? '' : content.missing.from,
            to: toDate ? '' : content.missing.to,
            dates: !fromDate && !toDate ? content.missing.dates : '',
          };
          const hasErrors = Object.values(errors).join('');

          return (
            <li key={locationAndName + index} className={listClassNames}>
              <div className={hasErrors ? errorClassNames : ''}>
                {errors.name || (
                  <Header6
                    className="dd-privacy-hidden"
                    data-dd-action-name="VA location name"
                  >
                    {locationAndName}
                  </Header6>
                )}
                <div
                  className="dd-privacy-hidden"
                  data-dd-action-name="VA location treated issues"
                >
                  {errors.issues || readableList(issues)}
                </div>
                {errors.dates || (
                  <div
                    className="dd-privacy-hidden"
                    data-dd-action-name="VA location date range"
                  >
                    {errors.from || fromDate} – {errors.to || toDate}
                  </div>
                )}
                {!reviewMode && (
                  <div>
                    <Link
                      key={`edit-va-${index}`}
                      id={`edit-va-${index}`}
                      className="edit-item"
                      to={path}
                      aria-label={`${content.edit} ${locationAndName}`}
                      data-link={testing ? path : null}
                    >
                      {content.edit}
                    </Link>
                    <va-button
                      data-index={index}
                      data-type="va"
                      onClick={handlers.showModal}
                      class={removeButtonClass}
                      label={`${content.remove} ${locationAndName}`}
                      text={content.remove}
                      secondary
                      uswds
                    />
                  </div>
                )}
              </div>
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
 * @param {Object[]} list - Private medical evidence array
 * @param {String} limitContent - Private evidence limitation
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Boolean} onReviewPage - When true, list is rendered on review page
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
  const Header6 = getHeaderLevelH6toH5({ onReviewPage, reviewMode });
  const Header5 = getHeaderLevelH5toH4({ onReviewPage, reviewMode });
  return list?.length ? (
    <>
      <Header5>{content.privateTitle}</Header5>
      <ul className="evidence-summary">
        {list.map((facility, index) => {
          const {
            providerFacilityName,
            issues = [],
            providerFacilityAddress = {},
            treatmentDateRange = {},
          } = facility || {};
          const path = `/${EVIDENCE_PRIVATE_PATH}?index=${index}`;

          const fromDate = formatDate(treatmentDateRange.from);
          const toDate = formatDate(treatmentDateRange.to);
          const errors = {
            name: providerFacilityName ? '' : content.missing.facility,
            issues: issues.length ? '' : content.missing.condition,
            address:
              providerFacilityAddress.country &&
              providerFacilityAddress.street &&
              providerFacilityAddress.city &&
              providerFacilityAddress.state &&
              providerFacilityAddress.postalCode
                ? ''
                : content.missing.address,
            from: fromDate ? '' : content.missing.from,
            to: toDate ? '' : content.missing.to,
            dates: !fromDate && !toDate ? content.missing.dates : '',
          };
          const hasErrors = Object.values(errors).join('');

          return (
            <li key={providerFacilityName + index} className={listClassNames}>
              <div className={hasErrors ? errorClassNames : ''}>
                {errors.name || (
                  <Header6
                    className="dd-privacy-hidden"
                    data-dd-action-name="Private facility name"
                  >
                    {providerFacilityName}
                  </Header6>
                )}
                <div
                  className="dd-privacy-hidden"
                  data-dd-action-name="Private facility treated issues"
                >
                  {errors.issues || readableList(issues)}
                </div>
                <div>{errors.address}</div>
                {errors.dates || (
                  <div
                    className="dd-privacy-hidden"
                    data-dd-action-name="Private facility treatment date range"
                  >
                    {errors.from || fromDate} – {errors.to || toDate}
                  </div>
                )}
                {!reviewMode && (
                  <div>
                    <Link
                      id={`edit-private-${index}`}
                      className="edit-item"
                      to={path}
                      aria-label={`${content.edit} ${providerFacilityName}`}
                      data-link={testing ? path : null}
                    >
                      {content.edit}
                    </Link>
                    <va-button
                      data-index={index}
                      data-type="private"
                      onClick={handlers.showModal}
                      class={removeButtonClass}
                      label={`${content.remove} ${providerFacilityName}`}
                      text={content.remove}
                      secondary
                      uswds
                    />
                  </div>
                )}
              </div>
            </li>
          );
        })}
        <li key={LIMITATION_KEY} className={listClassNames}>
          <Header6>{limitContent.title}</Header6>
          <p>{limitContent.review[limitedConsent.length ? 'y' : 'n']}</p>
          {!reviewMode && (
            <div>
              <Link
                id="edit-limitation"
                className="edit-item"
                to={`/${EVIDENCE_LIMITATION_PATH}`}
                aria-label={`${content.edit} ${limitContent.name} `}
                data-link={testing ? EVIDENCE_LIMITATION_PATH : null}
              >
                {content.edit}
              </Link>
              {limitedConsent.length ? (
                <va-button
                  data-type={LIMITATION_KEY}
                  onClick={handlers.showModal}
                  class={removeButtonClass}
                  label={`${content.remove} ${limitContent.name}`}
                  text={content.remove}
                  secondary
                  uswds
                />
              ) : null}
            </div>
          )}
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
 * @param {Boolean} onReviewPage - When true, list is rendered on review page
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
  const Header6 = getHeaderLevelH6toH5({ onReviewPage, reviewMode });
  const Header5 = getHeaderLevelH5toH4({ onReviewPage, reviewMode });
  return list?.length ? (
    <>
      <Header5>{content.otherTitle}</Header5>
      <ul className="evidence-summary">
        {list.map((upload, index) => (
          <li key={upload.name + index} className={listClassNames}>
            <Header6
              className="dd-privacy-hidden"
              data-dd-action-name="Uploaded document file name"
            >
              {upload.name}
            </Header6>
            <div>{ATTACHMENTS_OTHER[upload.attachmentId] || ''}</div>
            {!reviewMode && (
              <div>
                <Link
                  id={`edit-upload-${index}`}
                  className="edit-item"
                  to={`/${EVIDENCE_UPLOAD_PATH}#${index}`}
                  aria-label={`${content.editLinkAria} ${upload.name}`}
                  data-link={testing ? EVIDENCE_UPLOAD_PATH : null}
                >
                  {content.edit}
                </Link>
                <va-button
                  data-index={index}
                  data-type="upload"
                  onClick={handlers.showModal}
                  class={removeButtonClass}
                  label={`${content.remove} ${upload.name}`}
                  text={content.remove}
                  secondary
                  uswds
                />
              </div>
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
