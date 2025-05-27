import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';
import { title4142WithId } from '../content/title';
import { content } from '../content/evidenceSummary';
import {
  authorizationLabel,
  authorizationError,
} from '../content/evidencePrivateRecordsAuthorization';
import { content as limitContent } from '../content/evidencePrivateLimitation';
import {
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_PRIVATE_AUTHORIZATION,
  EVIDENCE_LIMITATION_PATH,
  EVIDENCE_LIMITATION_PATH1,
  EVIDENCE_LIMITATION_PATH2,
  LIMITATION_KEY,
} from '../constants';
import {
  confirmationPageLabel,
  errorClassNames,
  listClassNames,
  removeButtonClass,
} from '../utils/evidence-classnames';
import { formatDate } from '../utils/evidence';

/**
 * Build private evidence list
 * @param {Object[]} list - Private medical evidence array
 * @param {String} limitContent - Private evidence limitation
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Boolean} isOnReviewPage - When true, list is rendered on review page
 * @param {Object} handlers - Event callback functions for links & buttons
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const EvidencePrivateContent = ({
  list = [],
  limitedConsent = '',
  isOnReviewPage,
  reviewMode = false,
  handlers = {},
  privacyAgreementAccepted,
  testing,
  showListOnly = false,
  showScNewForm = false,
  showLimitedConsentYN = false,
}) => {
  if (!list?.length) {
    return null;
  }
  const Header = isOnReviewPage ? 'h5' : 'h4';

  const showAddress = (
    { street, street2, city, state, postalCode, country },
    errors,
  ) => (
    <div
      className="vads-u-margin-bottom--1 facility-address dd-privacy-hidden"
      data-dd-action-name="Non-VA facility address"
    >
      <div>{street}</div>
      {street2 && <div>{street2}</div>}
      <div>
        {city}, {state} {postalCode}
      </div>
      {country !== 'USA' && <div>{country}</div>}
      {errors.address}
    </div>
  );

  return (
    <>
      <Header
        className={`private-title ${confirmationPageLabel(showListOnly)}`}
      >
        {content.privateTitle}
      </Header>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="evidence-summary remove-bullets" role="list">
        {showScNewForm && (
          <li className={listClassNames(!showListOnly)}>
            <div
              className={`private-authorization ${confirmationPageLabel(
                showListOnly,
              )}`}
            >
              {title4142WithId}
            </div>
            <div>
              {privacyAgreementAccepted ? (
                authorizationLabel
              ) : (
                // including non-empty error attribute for focus management
                <span className="usa-input-error-message" error="error">
                  {authorizationError}
                </span>
              )}
            </div>
            {!reviewMode && (
              <div className="vads-u-margin-top--1p5">
                <Link
                  id="edit-private-authorization"
                  className="edit-item"
                  to={`/${EVIDENCE_PRIVATE_AUTHORIZATION}`}
                  aria-label={`edit ${title4142WithId}`}
                  data-link={testing ? EVIDENCE_PRIVATE_AUTHORIZATION : null}
                >
                  {content.edit}
                </Link>
              </div>
            )}
          </li>
        )}
        {showScNewForm && (
          <li className={listClassNames(!showListOnly)}>
            <div
              className={`private-limitation-yn ${confirmationPageLabel(
                showListOnly,
              )}`}
            >
              {limitContent.title}
            </div>
            <div>{showLimitedConsentYN ? 'Yes' : 'No'}</div>
            {!reviewMode && (
              <div className="vads-u-margin-top--1p5">
                <Link
                  id="edit-limitation-y-n"
                  className="edit-item"
                  to={`/${EVIDENCE_LIMITATION_PATH1}`}
                  aria-label={`${content.edit} ${limitContent.title} `}
                  data-link={testing ? EVIDENCE_LIMITATION_PATH1 : null}
                >
                  {content.edit}
                </Link>
              </div>
            )}
          </li>
        )}
        {showLimitedConsentYN && (
          <li key={LIMITATION_KEY} className={listClassNames(!showListOnly)}>
            <div
              className={`private-limitation ${confirmationPageLabel(
                showListOnly,
              )}`}
            >
              {limitContent.textAreaTitle}
            </div>
            <div>{limitedConsent}</div>
            {!reviewMode && (
              <div className="vads-u-margin-top--1p5">
                <Link
                  id="edit-limitation"
                  className="edit-item"
                  to={`/${EVIDENCE_LIMITATION_PATH2}`}
                  aria-label={`${content.edit} ${limitContent.textAreaTitle}`}
                  data-link={testing ? EVIDENCE_LIMITATION_PATH2 : null}
                >
                  {content.edit}
                </Link>
              </div>
            )}
          </li>
        )}
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
              className={`${listClassNames(
                !showListOnly,
              )} vads-u-margin-bottom--2`}
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
                {showListOnly ? (
                  showAddress(providerFacilityAddress, errors)
                ) : (
                  <div>{errors.address}</div>
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
                    className="dd-privacy-hidden vads-u-margin-bottom--1p5"
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
                    />
                  </div>
                )}
              </div>
            </li>
          );
        })}
        {!showScNewForm && (
          <li key={LIMITATION_KEY} className={listClassNames(!showListOnly)}>
            <strong
              className={`private-limitation ${confirmationPageLabel(
                showListOnly,
              )}`}
            >
              {limitContent.title}
            </strong>

            <div>{limitContent.review[limitedConsent.length ? 'y' : 'n']}</div>

            {!reviewMode && (
              <div className="vads-u-margin-top--1p5">
                <Link
                  id="edit-limitation"
                  className="edit-item"
                  to={`/${EVIDENCE_LIMITATION_PATH}`}
                  aria-label={`${content.edit} ${limitContent.name}`}
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
                  />
                ) : null}
              </div>
            )}
          </li>
        )}
      </ul>
    </>
  );
};

EvidencePrivateContent.propTypes = {
  handlers: PropTypes.shape({}),
  isOnReviewPage: PropTypes.bool,
  limitedConsent: PropTypes.string,
  list: PropTypes.array,
  privacyAgreementAccepted: PropTypes.bool,
  reviewMode: PropTypes.bool,
  showLimitedConsentYN: PropTypes.bool,
  showListOnly: PropTypes.bool,
  showScNewForm: PropTypes.bool,
  testing: PropTypes.bool,
};
