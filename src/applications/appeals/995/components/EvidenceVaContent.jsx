import React from 'react';
import PropTypes from 'prop-types';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';
import BasicLink from '../../shared/components/web-component-wrappers/BasicLink';
import { content } from '../content/evidenceSummary';
import { content as vaContent } from '../content/evidenceVaRecords';
import { EVIDENCE_VA_PATH } from '../constants';
import { FORMAT_READABLE_MMYY_DATE_FNS } from '../../shared/constants';
import {
  confirmationPageLabel,
  errorClassNames,
  listClassNames,
  removeButtonClass,
} from '../utils/evidence-classnames';
import { formatDate } from '../utils/evidence';

/**
 * Build VA evidence list
 * @param {Object[]} list - VA evidence array
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Boolean} isOnReviewPage - When true, list is rendered on review page
 * @param {Object} handlers - Event callback functions for links & buttons
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const EvidenceVaContent = ({
  list = [],
  isOnReviewPage,
  reviewMode = false,
  handlers = {},
  testing,
  showScNewForm,
  showListOnly = false,
}) => {
  if (!list?.length) {
    return null;
  }
  const Header = isOnReviewPage ? 'h5' : 'h4';

  return (
    <>
      <Header className={`va-title ${confirmationPageLabel(showListOnly)}`}>
        {content.vaTitle}
      </Header>
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
              className={`${listClassNames(
                !showListOnly,
              )} vads-u-margin-bottom--2`}
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

EvidenceVaContent.propTypes = {
  handlers: PropTypes.shape({}),
  isOnReviewPage: PropTypes.bool,
  list: PropTypes.array,
  reviewMode: PropTypes.bool,
  showListOnly: PropTypes.bool,
  showScNewForm: PropTypes.bool,
  testing: PropTypes.bool,
};
