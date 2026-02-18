import React from 'react';
import PropTypes from 'prop-types';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';
import BasicLink from '../../../shared/components/web-component-wrappers/BasicLink';
import { auth4142Title } from '../../content/evidence/form4142';
import { content } from '../../content/evidence/summary';
import { detailsQuestion as limitedConsentDetailsQuestion } from '../../pages/limitedConsentDetails';
import { promptQuestion as limitedConsentPromptQuestion } from '../../pages/limitedConsentPrompt';
import {
  AUTHORIZATION_LABEL,
  EVIDENCE_PRIVATE_DETAILS_URL,
  EVIDENCE_PRIVATE_AUTHORIZATION_URL,
  LIMITED_CONSENT_PROMPT_URL,
  LIMITED_CONSENT_DETAILS_URL,
  LIMITATION_KEY,
} from '../../constants';
import {
  confirmationPageLabel,
  errorClassNames,
  listClassNames,
  removeButtonClass,
} from '../../utils/evidence-classnames';
import { formatDate } from '../../utils/evidence';

/**
 * Build private evidence list
 * @param {Object[]} list - Private medical evidence array
 * @param {String} limitedConsentContent - Private evidence limitation
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Boolean} isOnReviewPage - When true, list is rendered on review page
 * @param {Object} handlers - Event callback functions for links & buttons
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const PrivateDetailsDisplay = ({
  list = [],
  limitedConsent = '',
  isOnReviewPage,
  reviewMode = false,
  handlers = {},
  privacyAgreementAccepted,
  testing,
  showListOnly = false,
  limitedConsentResponse,
}) => {
  if (!list?.length) {
    return null;
  }

  const Header = isOnReviewPage ? 'h5' : 'h4';
  const SubHeader = isOnReviewPage ? 'h6' : 'h5';

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
        <li className={listClassNames(!showListOnly)}>
          <SubHeader
            className={`private-authorization vads-u-margin-y--0 ${confirmationPageLabel(
              showListOnly,
            )}`}
          >
            {auth4142Title}
          </SubHeader>
          <p>
            {privacyAgreementAccepted ? (
              AUTHORIZATION_LABEL
            ) : (
              // including non-empty error attribute for focus management
              <span className="usa-input-error-message" error="error">
                You must give us authorization for us to get your non-VA medical
                records
              </span>
            )}
          </p>
          {!reviewMode && (
            <div className="vads-u-margin-top--1p5">
              <BasicLink
                disableAnalytics
                id="edit-private-authorization"
                className="edit-item"
                aria-label={`edit ${auth4142Title}`}
                data-link={testing ? EVIDENCE_PRIVATE_AUTHORIZATION_URL : null}
                path={`/${EVIDENCE_PRIVATE_AUTHORIZATION_URL}`}
                text={content.edit}
              />
            </div>
          )}
        </li>
        <li className={listClassNames(!showListOnly)}>
          <SubHeader
            className={`private-limitation-yn vads-u-margin-y--0 ${confirmationPageLabel(
              showListOnly,
            )}`}
          >
            {limitedConsentPromptQuestion}
          </SubHeader>
          <p>{limitedConsentResponse ? 'Yes' : 'No'}</p>
          {!reviewMode && (
            <div className="vads-u-margin-top--1p5">
              <BasicLink
                disableAnalytics
                id="edit-limitation-y-n"
                className="edit-item"
                path={`/${LIMITED_CONSENT_PROMPT_URL}`}
                aria-label={`${content.edit} ${limitedConsentPromptQuestion} `}
                data-link={testing ? LIMITED_CONSENT_PROMPT_URL : null}
                text={content.edit}
              />
            </div>
          )}
        </li>
        {limitedConsentResponse && (
          <li key={LIMITATION_KEY} className={listClassNames(!showListOnly)}>
            <SubHeader
              className={`private-limitation
                vads-u-margin-y--0
                ${confirmationPageLabel(showListOnly)}`}
            >
              {limitedConsentDetailsQuestion}
            </SubHeader>
            <p>{limitedConsent}</p>
            {!reviewMode && (
              <div className="vads-u-margin-top--1p5">
                <BasicLink
                  disableAnalytics
                  id="edit-limitation"
                  className="edit-item"
                  path={`/${LIMITED_CONSENT_DETAILS_URL}`}
                  aria-label={`${
                    content.edit
                  } ${limitedConsentDetailsQuestion}`}
                  data-link={testing ? LIMITED_CONSENT_DETAILS_URL : null}
                  text={content.edit}
                />
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
          const path = `/${EVIDENCE_PRIVATE_DETAILS_URL}?index=${index}`;

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
                  <SubHeader
                    className="private-facility vads-u-margin-bottom--2 dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold"
                    data-dd-action-name="Non-VA facility name"
                  >
                    {providerFacilityName}
                  </SubHeader>
                )}
                {showListOnly ? (
                  showAddress(providerFacilityAddress, errors)
                ) : (
                  <div>{errors.address}</div>
                )}
                <p
                  className="dd-privacy-hidden vads-u-margin-bottom--1 overflow-wrap-word"
                  data-dd-action-name="Non-VA facility treated issues"
                >
                  {errors.issues || readableList(issues)}
                </p>
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
                    <BasicLink
                      disableAnalytics
                      id={`edit-private-${index}`}
                      className="edit-item"
                      path={path}
                      aria-label={`${content.edit} ${providerFacilityName}`}
                      data-link={testing ? path : null}
                      text={content.edit}
                    />
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
      </ul>
    </>
  );
};

PrivateDetailsDisplay.propTypes = {
  handlers: PropTypes.shape({}),
  isOnReviewPage: PropTypes.bool,
  limitedConsent: PropTypes.string,
  limitedConsentResponse: PropTypes.bool,
  list: PropTypes.array,
  privacyAgreementAccepted: PropTypes.bool,
  reviewMode: PropTypes.bool,
  showListOnly: PropTypes.bool,
  testing: PropTypes.bool,
};
