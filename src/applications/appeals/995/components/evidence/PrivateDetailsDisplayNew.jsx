import React from 'react';
import PropTypes from 'prop-types';
import BasicLink from '../../../shared/components/web-component-wrappers/BasicLink';
import { content as authContent } from '../4142/Authorization';
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
import { formatDateToReadableString } from '../../../shared/utils/dates';
import { formatIssueList } from '../../../shared/utils/contestableIssueMessages';

/**
 * Build private evidence list
 * @param {Object[]} data - Private medical evidence array
 * @param {String} limitedConsentContent - Private evidence limitation
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Boolean} isOnReviewPage - When true, list is rendered on review page
 * @param {Object} handlers - Event callback functions for links & buttons
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const PrivateDetailsDisplayNew = ({
  data,
  isOnReviewPage,
  reviewMode = false,
  handlers = {},
  testing,
  showListOnly = false,
}) => {
  if (!data) {
    return null;
  }

  const { auth4142, lcDetails, lcPrompt, privateEvidence } = data;

  const Header = isOnReviewPage ? 'h5' : 'h4';
  const SubHeader = isOnReviewPage ? 'h6' : 'h5';

  const showAddress = (
    { street, street2, city, state, postalCode, country },
    errors,
  ) => (
    <p
      className="vads-u-margin-bottom--1 facility-address dd-privacy-hidden"
      data-dd-action-name="Non-VA facility address"
    >
      {street}
      {street2 ? (
        <>
          <br />
          {street2}
        </>
      ) : null}
      <br />
      {city}, {state} {postalCode}
      {country !== 'USA' ? (
        <>
          <br />
          {country}
        </>
      ) : null}
      {errors.address ? (
        <>
          <br />
          {errors.address}
        </>
      ) : null}
    </p>
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
            {authContent.title}
          </SubHeader>
          <p>
            {auth4142 ? (
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
                aria-label={`edit ${authContent.title}`}
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
          <p>{lcPrompt === 'Y' ? 'Yes' : 'No'}</p>
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
        {lcPrompt === 'Y' &&
          lcDetails && (
            <li key={LIMITATION_KEY} className={listClassNames(!showListOnly)}>
              <SubHeader
                className={`private-limitation
                vads-u-margin-y--0
                ${confirmationPageLabel(showListOnly)}`}
              >
                {limitedConsentDetailsQuestion}
              </SubHeader>
              <p>{lcDetails}</p>
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
        {privateEvidence.map((facility, index) => {
          const {
            address,
            privateTreatmentLocation,
            treatmentEnd,
            treatmentStart,
            issues,
          } = facility || {};

          const path = `/${EVIDENCE_PRIVATE_DETAILS_URL}?index=${index}`;

          const fromDate = formatDateToReadableString(
            new Date(`${treatmentStart}T12:00:00`),
          );

          const toDate = formatDateToReadableString(
            new Date(`${treatmentEnd}T12:00:00`),
          );

          const selectedIssues = Object.keys(issues).filter(
            issue => issues[issue],
          );

          const errors = {
            name: privateTreatmentLocation ? '' : content.missing.facility,
            issues: selectedIssues.length ? '' : content.missing.condition,
            address:
              address.country &&
              address.street &&
              address.city &&
              address.state &&
              address.postalCode
                ? ''
                : content.missing.address,
            from: fromDate ? '' : content.missing.from,
            to: toDate ? '' : content.missing.to,
            dates: !fromDate && !toDate ? content.missing.dates : '',
          };

          const hasErrors = Object.values(errors).join('');

          return (
            <li
              key={privateTreatmentLocation + index}
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
                    {privateTreatmentLocation}
                  </SubHeader>
                )}
                {showListOnly ? (
                  showAddress(address, errors)
                ) : (
                  <div>{errors.address}</div>
                )}
                <p
                  className="dd-privacy-hidden vads-u-margin-bottom--1 overflow-wrap-word"
                  data-dd-action-name="Non-VA facility treated issues"
                >
                  {errors.issues || formatIssueList(selectedIssues)}
                </p>
                <div>{errors.address}</div>
                {errors.dates || (
                  <p
                    className="dd-privacy-hidden vads-u-margin-bottom--1p5"
                    data-dd-action-name="Non-VA facility treatment date range"
                  >
                    {errors.from || fromDate} – {errors.to || toDate}
                  </p>
                )}
                {!reviewMode && (
                  <div className="vads-u-margin-top--1p5">
                    <BasicLink
                      disableAnalytics
                      id={`edit-private-${index}`}
                      className="edit-item"
                      path={path}
                      aria-label={`${content.edit} ${privateTreatmentLocation}`}
                      data-link={testing ? path : null}
                      text={content.edit}
                    />
                    <va-button
                      data-index={index}
                      data-type="private"
                      onClick={handlers.showModal}
                      class={removeButtonClass}
                      label={`${content.remove} ${privateTreatmentLocation}`}
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

PrivateDetailsDisplayNew.propTypes = {
  data: PropTypes.shape({
    auth4142: PropTypes.bool,
    lcDetails: PropTypes.string,
    lcPrompt: PropTypes.string,
    privateEvidence: PropTypes.arrayOf(
      PropTypes.shape({
        address: {
          'view:militaryBaseDescription': PropTypes.string,
          city: PropTypes.string,
          country: PropTypes.string,
          postalCode: PropTypes.string,
          state: PropTypes.string,
          street: PropTypes.string,
          street2: PropTypes.string,
        },
        issues: PropTypes.arrayOf(PropTypes.string),
        privateTreatmentLocation: PropTypes.string,
        treatmentEnd: PropTypes.string,
        treatmentStart: PropTypes.string,
      }),
    ),
  }),
  handlers: PropTypes.shape({}),
  isOnReviewPage: PropTypes.bool,
  reviewMode: PropTypes.bool,
  showListOnly: PropTypes.bool,
  testing: PropTypes.bool,
};
