import React from 'react';
import { format } from 'date-fns';

import get from 'platform/utilities/data/get';

import { SELECTED } from '../constants';

/**
 * ContestableIssueAttributes - flattened in the widget
 * @typedef {Object[]}
 * @property {String} ratingIssueSubjectText - contestable issue title
 * @property {String} description - contestable issue description
 * @property {String} ratingIssuePercentNumber - rating %, number with no %
 * @property {String} approxDecisionDate - date formatted as "YYYY-MM-DD"
 */
/**
 * IssueCards
 * @typedef {Object}
 * @property {Object} formContext - Form system state
 * @property {String} id - ID base for form elements
 * @property {ContestableIssueAttributes} items - array values
 * @property {Object} options - ui:options
 * @property {func} onChange - onChange callback
 * @property {Boolean} onReviewPage - on review & submit page flag
 * @property {Boolean} inReviewMode - review mode vs edit mode
 * @property {Boolean} checkboxVisible - don't show checkbox on review & submit
 *  page when not in edit mode
 */
export default function IssueCards({
  id,
  items = [],
  options,
  onChange,
  onReviewPage,
  inReviewMode,
  checkboxVisible,
}) {
  const itemsLength = items?.length;

  return (
    <>
      {itemsLength ? (
        items.map((item, index) => {
          const itemIsSelected = !!get(SELECTED, item);

          // Don't show un-selected ratings in review mode
          if (inReviewMode && !itemIsSelected) {
            return null;
          }

          // On the review & submit page, there may be more than one
          // of these components in edit mode with the same content, e.g. 526
          // ratedDisabilities & unemployabilityDisabilities causing
          // duplicate input ids/names... an `appendId` value is added to the
          // ui:options
          const appendId = options.appendId ? `_${options.appendId}` : '';
          const elementId = `${id}_${index}${appendId}`;

          const wrapperClass = [
            'review-row',
            'widget-wrapper',
            'vads-u-border--0',
            checkboxVisible ? '' : 'checkbox-hidden',
            `vads-u-padding-top--${checkboxVisible ? 1 : 0}`,
            'vads-u-padding-right--3',
            index < itemsLength - 1 ? 'vads-u-margin-bottom--3' : '',
          ].join(' ');

          const outlineClass = [
            'widget-outline',
            'vads-u-margin-top--0',
            itemIsSelected ? 'selected' : '',
          ].join(' ');

          const widgetContent = [
            'widget-content',
            'vads-u-font-weight--normal',
          ].join(' ');

          return (
            <div className={wrapperClass} key={index}>
              <dt className="widget-checkbox-wrap">
                {checkboxVisible ? (
                  <>
                    <input
                      type="checkbox"
                      id={elementId}
                      name={elementId}
                      checked={
                        typeof itemIsSelected === 'undefined'
                          ? false
                          : itemIsSelected
                      }
                      onChange={event => onChange(index, event.target.checked)}
                    />
                    <label
                      className={`schemaform-label ${outlineClass}`}
                      htmlFor={elementId}
                    >
                      <IssueCardTitle {...item} />
                    </label>
                  </>
                ) : (
                  <div className={outlineClass} />
                )}
              </dt>
              <dd className={widgetContent}>
                {!checkboxVisible && (
                  <IssueCardTitle {...item} checkboxVisible={checkboxVisible} />
                )}
                <IssueCardContent {...item} />
              </dd>
            </div>
          );
        })
      ) : (
        <>
          <dt>
            {onReviewPage ? (
              'No issues selected'
            ) : (
              <strong>No issues found</strong>
            )}
          </dt>
          <dd />
        </>
      )}
    </>
  );
}

/**
 * IssueCardTitle
 * @param {String} ratingIssueSubjectText - contestable issue title
 * @return {React Component}
 */
export const IssueCardTitle = ({ ratingIssueSubjectText }) => {
  const className = [
    'widget-title',
    'vads-u-font-size--md',
    'vads-u-font-weight--bold',
    'vads-u-line-height--1',
  ].join(' ');

  return <div className={className}>{ratingIssueSubjectText}</div>;
};

/**
 * IssueCardContent
 * @param {String} description - contestable issue description
 * @param {String} ratingIssuePercentNumber - rating %, number with no %
 * @param {String} approxDecisionDate - date formatted as "YYYY-MM-DD"
 * @return {React Component}
 */
export function IssueCardContent({
  description,
  ratingIssuePercentNumber,
  approxDecisionDate,
}) {
  // May need to throw an error to Sentry if any of these don't exist
  // A valid rated disability *can* have a rating percentage of 0%
  const showPercentNumber = (ratingIssuePercentNumber || '') !== '';

  return (
    <>
      {description && (
        <p className="vads-u-margin-bottom--0">{description || ''}</p>
      )}
      {showPercentNumber && (
        <p className="vads-u-margin-bottom--0">
          Current rating: <strong>{ratingIssuePercentNumber}%</strong>
        </p>
      )}
      {approxDecisionDate && (
        <p>
          Decision date:{' '}
          <strong>
            {format(new Date(approxDecisionDate), 'MMMM d, yyyy')}
          </strong>
        </p>
      )}
    </>
  );
}
