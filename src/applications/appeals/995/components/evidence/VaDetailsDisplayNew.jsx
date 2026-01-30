import React from 'react';
import PropTypes from 'prop-types';
import BasicLink from '../../../shared/components/web-component-wrappers/BasicLink';
import { content } from '../../content/evidence/summary';
import { EVIDENCE_VA_DETAILS_URL } from '../../constants';
import {
  confirmationPageLabel,
  errorClassNames,
  listClassNames,
  removeButtonClass,
} from '../../utils/evidence-classnames';
import { formatDateToReadableString } from '../../../shared/utils/dates';

// treatment date only includes YYYY-MM; include '-01' to fit parser
export const getFormattedTreatmentDate = treatmentDate => {
  if (!treatmentDate) {
    return null;
  }

  return formatDateToReadableString(new Date(`${treatmentDate}-01T12:00:00`));
};

export const getLocationErrors = (
  treatmentBefore2005,
  treatmentMonthYear,
  vaTreatmentLocation,
) => {
  const errors = {
    name: vaTreatmentLocation ? '' : content.missing.location,
    treatmentMonthYear:
      treatmentBefore2005 === 'Y' && !treatmentMonthYear
        ? content.missing.date
        : '',
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
export const VaDetailsDisplayNew = ({
  handlers = {},
  isOnReviewPage,
  list = [],
  reviewMode = false,
  showListOnly = false,
  testing,
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
          const {
            treatmentBefore2005,
            treatmentMonthYear = '',
            vaTreatmentLocation,
          } = location || {};
          const path = `/${EVIDENCE_VA_DETAILS_URL}?index=${index}`;

          const formattedTreatmentDate = getFormattedTreatmentDate(
            treatmentMonthYear,
          );

          const { errors, hasErrors } = getLocationErrors(
            treatmentBefore2005,
            treatmentMonthYear,
            vaTreatmentLocation,
          );

          return (
            <li
              key={vaTreatmentLocation + index}
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
                    {vaTreatmentLocation}
                  </SubHeader>
                )}
                {errors.treatmentMonthYear || (
                  <p
                    className="dd-privacy-hidden vads-u-margin-y--0"
                    data-dd-action-name="VA location treatment date"
                  >
                    {formattedTreatmentDate}
                  </p>
                )}
                {!reviewMode && (
                  <div className="vads-u-margin-top--1p5">
                    <BasicLink
                      disableAnalytics
                      key={`edit-va-${index}`}
                      id={`edit-va-${index}`}
                      className="edit-item"
                      path={path}
                      aria-label={`${content.edit} ${vaTreatmentLocation}`}
                      data-link={testing ? path : null}
                      text={content.edit}
                    />
                    <va-button
                      data-index={index}
                      data-type="va"
                      onClick={handlers.showModal}
                      class={removeButtonClass}
                      label={`${content.remove} ${vaTreatmentLocation}`}
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

VaDetailsDisplayNew.propTypes = {
  handlers: PropTypes.shape({}),
  isOnReviewPage: PropTypes.bool,
  list: PropTypes.array,
  reviewMode: PropTypes.bool,
  showListOnly: PropTypes.bool,
  testing: PropTypes.bool,
};
