import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

import { content } from '../content/evidenceSummary';
import { content as limitContent } from '../content/evidencePrivateLimitation';
import { content as vaContent } from '../content/evidenceVaRecords';
import { parseDate } from '../../shared/utils/dates';

import {
  EVIDENCE_VA_PATH,
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_LIMITATION_PATH,
  EVIDENCE_UPLOAD_PATH,
  ATTACHMENTS_OTHER,
  LIMITATION_KEY,
} from '../constants';

import {
  FORMAT_COMPACT_DATE_FNS,
  FORMAT_YMD_DATE_FNS,
  FORMAT_READABLE_MMYY_DATE_FNS,
} from '../../shared/constants';

const listClassNames = (addBorder = true) =>
  [
    'vads-u-padding-x--0',
    addBorder ? 'vads-u-border-top--1px' : '',
    addBorder ? 'vads-u-border-color--gray-light' : '',
    addBorder ? 'vads-u-padding-y--2' : '',
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

const formatDate = (date = '', format = FORMAT_COMPACT_DATE_FNS) =>
  // Use `parse` from date-fns because it is a non-ISO8061 formatted date string
  // const parsedDate = parse(date, FORMAT_YMD_DATE_FNS, new Date());
  parseDate(date, format, FORMAT_YMD_DATE_FNS) || '';

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
  handlers = {},
  testing,
  showScNewForm,
  showListOnly = false,
}) =>
  list?.length ? (
    <>
      <div className="va-title">{content.vaTitle}</div>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="evidence-summary remove-bullets" role="list">
        {list.map((location, index) => {
          const {
            locationAndName,
            issues = [],
            evidenceDates = {},
            treatmentDate = '',
            noDate,
          } = location || {};
          const path = `/${EVIDENCE_VA_PATH}?index=${index}`;
          const fromDate = formatDate(evidenceDates.from);
          const toDate = formatDate(evidenceDates.to);
          // treatment date only includes YYYY-MM; include '-01' to fit parser
          const formattedTreatmentDate =
            !noDate &&
            formatDate(`${treatmentDate}-01`, FORMAT_READABLE_MMYY_DATE_FNS);
          const errors = {
            name: locationAndName ? '' : content.missing.location,
            issues: issues.length ? '' : content.missing.condition,
            from: showScNewForm || fromDate ? '' : content.missing.from,
            to: showScNewForm || toDate ? '' : content.missing.to,
            dates:
              !showScNewForm && !fromDate && !toDate
                ? content.missing.dates
                : '',
            treatmentDate:
              (showScNewForm &&
                (noDate || treatmentDate ? '' : content.missing.date)) ||
              '',
          };
          const hasErrors = Object.values(errors).join('');

          return (
            <li
              key={locationAndName + index}
              className={listClassNames(!showListOnly)}
            >
              <div className={hasErrors ? errorClassNames : ''}>
                {errors.name || (
                  <strong
                    className="va-location dd-privacy-hidden overflow-wrap-word"
                    data-dd-action-name="VA location name"
                  >
                    {locationAndName}
                  </strong>
                )}
                <div
                  className="dd-privacy-hidden overflow-wrap-word"
                  data-dd-action-name="VA location treated issues"
                >
                  {errors.issues || readableList(issues)}
                </div>
                {!showScNewForm &&
                  (errors.dates || (
                    <div
                      className="dd-privacy-hidden"
                      data-dd-action-name="VA location date range"
                    >
                      {errors.from || fromDate} – {errors.to || toDate}
                    </div>
                  ))}
                {showScNewForm && noDate && vaContent.noDate}
                {showScNewForm &&
                  !noDate &&
                  (errors.treatmentDate || (
                    <div
                      className="dd-privacy-hidden"
                      data-dd-action-name="VA location treatment date"
                    >
                      {formattedTreatmentDate}
                    </div>
                  ))}
                {!reviewMode && (
                  <div className="vads-u-margin-top--1p5">
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

VaContent.propTypes = {
  handlers: PropTypes.shape({}),
  list: PropTypes.array,
  reviewMode: PropTypes.bool,
  showListOnly: PropTypes.bool,
  showScNewForm: PropTypes.bool,
  testing: PropTypes.bool,
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
  handlers = {},
  testing,
  showListOnly = false,
}) =>
  list?.length ? (
    <>
      <div className="private-title">{content.privateTitle}</div>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="evidence-summary remove-bullets" role="list">
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
            <li
              key={providerFacilityName + index}
              className={listClassNames(!showListOnly)}
            >
              <div className={hasErrors ? errorClassNames : ''}>
                {errors.name || (
                  <strong
                    className="private-facility dd-privacy-hidden overflow-wrap-word"
                    data-dd-action-name="Non-VA facility name"
                  >
                    {providerFacilityName}
                  </strong>
                )}
                <div
                  className="dd-privacy-hidden overflow-wrap-word"
                  data-dd-action-name="Non-VA facility treated issues"
                >
                  {errors.issues || readableList(issues)}
                </div>
                <div>{errors.address}</div>
                {errors.dates || (
                  <div
                    className="dd-privacy-hidden"
                    data-dd-action-name="Non-VA facility treatment date range"
                  >
                    {errors.from || fromDate} – {errors.to || toDate}
                  </div>
                )}
                {!reviewMode && (
                  <div className="vads-u-margin-top--1p5">
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
        <li key={LIMITATION_KEY} className={listClassNames(!showListOnly)}>
          <div className="private-limitation">{limitContent.title}</div>
          <div>{limitContent.review[limitedConsent.length ? 'y' : 'n']}</div>
          {!reviewMode && (
            <div className="vads-u-margin-top--1p5">
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

PrivateContent.propTypes = {
  handlers: PropTypes.shape({}),
  limitedConsent: PropTypes.string,
  list: PropTypes.array,
  reviewMode: PropTypes.bool,
  showListOnly: PropTypes.bool,
  testing: PropTypes.bool,
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
  handlers = {},
  testing,
  showListOnly = false,
}) =>
  list?.length ? (
    <>
      <div className="upload-title">{content.otherTitle}</div>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="evidence-summary remove-bullets" role="list">
        {list.map((upload, index) => {
          const errors = {
            attachmentId: upload.attachmentId
              ? ''
              : content.missing.attachmentId,
          };
          const hasErrors = Object.values(errors).join('');

          return (
            <li
              key={upload.name + index}
              className={
                hasErrors ? errorClassNames : listClassNames(!showListOnly)
              }
            >
              <strong
                className="upload-file dd-privacy-hidden overflow-wrap-word"
                data-dd-action-name="Uploaded document file name"
              >
                {upload.name}
              </strong>
              <div>
                {errors.attachmentId ||
                  ATTACHMENTS_OTHER[upload.attachmentId] ||
                  ''}
              </div>
              {!reviewMode && (
                <div className="vads-u-margin-top--1p5">
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
                    label={`${content.delete} ${upload.name}`}
                    text={content.delete}
                    secondary
                    uswds
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  ) : null;

UploadContent.propTypes = {
  handlers: PropTypes.shape({}),
  list: PropTypes.array,
  reviewMode: PropTypes.bool,
  showListOnly: PropTypes.bool,
  testing: PropTypes.bool,
};
