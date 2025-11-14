import React from 'react';
import PropTypes from 'prop-types';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';
import BasicLink from '../../../shared/components/web-component-wrappers/BasicLink';
import { content } from '../../content/evidence/summary';
import { content as vaContent } from '../../content/evidence/vaDetails';
import { EVIDENCE_VA_DETAILS_URL } from '../../constants';
import { FORMAT_READABLE_MMYY_DATE_FNS } from '../../../shared/constants';
import {
  confirmationPageLabel,
  errorClassNames,
  listClassNames,
  removeButtonClass,
} from '../../utils/evidence-classnames';
import { formatDate } from '../../utils/evidence';

// treatment date only includes YYYY-MM; include '-01' to fit parser
export const getFormattedTreatmentDate = (noDate, treatmentDate) => {
  if (!noDate) {
    return formatDate(`${treatmentDate}-01`, FORMAT_READABLE_MMYY_DATE_FNS);
  }

  return null;
};

export const getLocationErrors = (
  issues,
  locationAndName,
  noDate,
  treatmentDate,
) => {
  const errors = {
    name: locationAndName ? '' : content.missing.location,
    issues: issues.length ? '' : content.missing.condition,
    treatmentDate: (noDate || treatmentDate ? '' : content.missing.date) || '',
  };

  const hasErrors = Object.values(errors).join('');

  return {
    errors,
    hasErrors,
  };
};
/**
 * Build VA evidence list
 * This component appears on:
 *   /supporting-evidence/summary (Evidence Review page)
 *   /review-and-submit (App Review page)
 *   /confirmation (App Confirmation page)
 * @param {Object[]} list - VA evidence array
 * @param {Boolean} reviewMode - When true, hide editing links & buttons. Is true on app review & confirmation pages
 * @param {Boolean} isOnReviewPage - When true, list is rendered on review page. Is true on app review page only
 * @param {Object} handlers - Event callback functions for links & buttons
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const VaDetailsDisplay = ({
  list = [],
  isOnReviewPage,
  reviewMode = false,
  handlers = {},
  testing,
  showListOnly = false,
}) => {
  if (!list?.length) {
    return null;
  }

  const Header = isOnReviewPage ? 'h5' : 'h4';
  const SubHeader = isOnReviewPage ? 'h6' : 'h5';

  return (
    <>
      <Header className={`va-title ${confirmationPageLabel(showListOnly)}`}>
        {content.vaTitle}
      </Header>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="evidence-summary remove-bullets" role="list">
        {list.map((location, index) => {
          const { locationAndName, issues = [], treatmentDate = '', noDate } =
            location || {};
          const path = `/${EVIDENCE_VA_DETAILS_URL}?index=${index}`;

          const formattedTreatmentDate = getFormattedTreatmentDate(
            noDate,
            treatmentDate,
          );

          const { errors, hasErrors } = getLocationErrors(
            issues,
            locationAndName,
            noDate,
            treatmentDate,
          );

          const treatmentDateError = !noDate && errors.treatmentDate;

          return (
            <li
              key={locationAndName + index}
              className={`${listClassNames(
                !showListOnly,
              )} vads-u-margin-bottom--2`}
            >
              <div className={hasErrors ? errorClassNames : ''}>
                {errors.name || (
                  <SubHeader
                    className="va-location vads-u-margin-bottom--2 dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold"
                    data-dd-action-name="VA location name"
                  >
                    {locationAndName}
                  </SubHeader>
                )}
                <p
                  className="dd-privacy-hidden vads-u-margin-bottom--1 overflow-wrap-word"
                  data-dd-action-name="VA location treated issues"
                >
                  {errors.issues || readableList(issues)}
                </p>
                {noDate && vaContent.noDate}
                {treatmentDateError ? (
                  errors.treatmentDate
                ) : (
                  <div
                    className="dd-privacy-hidden"
                    data-dd-action-name="VA location treatment date"
                  >
                    {formattedTreatmentDate}
                  </div>
                )}
                {!reviewMode && (
                  <div className="vads-u-margin-top--1p5">
                    <BasicLink
                      disableAnalytics
                      key={`edit-va-${index}`}
                      id={`edit-va-${index}`}
                      className="edit-item"
                      path={path}
                      aria-label={`${content.edit} ${locationAndName}`}
                      data-link={testing ? path : null}
                      text={content.edit}
                    />
                    <va-button
                      data-index={index}
                      data-type="va"
                      onClick={handlers.showModal}
                      class={removeButtonClass}
                      label={`${content.remove} ${locationAndName}`}
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

VaDetailsDisplay.propTypes = {
  handlers: PropTypes.shape({}),
  isOnReviewPage: PropTypes.bool,
  list: PropTypes.array,
  reviewMode: PropTypes.bool,
  showListOnly: PropTypes.bool,
  testing: PropTypes.bool,
};
