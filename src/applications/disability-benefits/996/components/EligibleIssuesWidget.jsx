import React from 'react';
import moment from 'moment';

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';

import { SELECTED, NULL_CONDITION_STRING } from '../constants';
import { ContestedIssuesAlert } from '../content/contestedIssues';

/**
 * @typedef {Object} ContestableIssueAttributes
 * @property {String} ratingIssueSubjectText - contestable issue title
 * @property {String} description - contestable issue description
 * @property {String} ratingIssuePercentNumber - rating %, number with no %
 * @property {String} approxDecisionDate - date formatted as "YYYY-MM-DD"
 */
/**
 * DisabilityTitle
 * @param {ContestableIssueAttributes} attributes
 * @param {Boolean} checkboxVisible - checkbox is not rendered in review mode on
 *  the review & submit page
 * @return {React Component}
 */
const DisabilityTitle = ({ attributes }) => {
  const { ratingIssueSubjectText } = attributes;
  const title =
    typeof ratingIssueSubjectText === 'string'
      ? ratingIssueSubjectText
      : NULL_CONDITION_STRING;

  const className = [
    'widget-title',
    'vads-u-font-size--md',
    'vads-u-font-weight--bold',
    'vads-u-line-height--1',
  ].join(' ');

  return <div className={className}>{title}</div>;
};

/**
 * DisabilityCard
 * @param {ContestableIssueAttributes} attributes
 * @param {Boolean} checkboxVisible - checkbox is not rendered in review mode on
 *  the review & submit page
 * @return {React Component}
 */
const DisabilityCard = ({ attributes }) => {
  const {
    description,
    ratingIssuePercentNumber,
    approxDecisionDate,
  } = attributes;

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
          <strong>{moment(approxDecisionDate).format('MMM D, YYYY')}</strong>
        </p>
      )}
    </>
  );
};

const EligibleIssuesWidget = props => {
  const onChange = (index, checked) => {
    const items = set(`[${index}].${SELECTED}`, checked, props.value);
    props.onChange(items);
  };

  const { value: items, id, options, required, formContext } = props;

  // inReviewMode = true (review page view, not in edit mode)
  // inReviewMode = false (in edit mode)
  const onReviewPage = formContext.onReviewPage;
  const inReviewMode = onReviewPage && formContext.reviewMode;

  const itemsLength = items?.length;
  const hasSelections = items?.reduce(
    (result, item) => result || !!get(SELECTED, item),
    false,
  );

  const showError = formContext.submitted && !hasSelections;
  const outerWrapClass = `review ${showError ? 'usa-input-error' : ''}`;

  const content = (
    <>
      {itemsLength && (!inReviewMode || (inReviewMode && hasSelections)) ? (
        items.map((item, index) => {
          const itemIsSelected = !!get(SELECTED, item);

          // Don't show un-selected ratings in review mode
          if (inReviewMode && !itemIsSelected) {
            return null;
          }

          const checkboxVisible =
            !onReviewPage || (onReviewPage && !inReviewMode);

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
                      required={required}
                      onChange={event => onChange(index, event.target.checked)}
                    />
                    <label
                      className={`schemaform-label ${outlineClass}`}
                      htmlFor={elementId}
                    >
                      <DisabilityTitle {...item} />
                    </label>
                  </>
                ) : (
                  <div className={outlineClass} />
                )}
              </dt>
              <dd className={widgetContent}>
                {!checkboxVisible && (
                  <DisabilityTitle
                    {...item}
                    checkboxVisible={checkboxVisible}
                  />
                )}
                <DisabilityCard {...item} />
              </dd>
            </div>
          );
        })
      ) : (
        // this section _shouldn't_ ever been seen
        <>
          <dt>
            {onReviewPage ? (
              'No items selected'
            ) : (
              <strong>No items found</strong>
            )}
          </dt>
          <dd />
        </>
      )}
    </>
  );
  return inReviewMode ? (
    <>
      {showError && <ContestedIssuesAlert />}
      {content}
    </>
  ) : (
    <div className={showError ? 'usa-input-error vads-u-margin-top--0' : ''}>
      {showError && <ContestedIssuesAlert />}
      <dl className={outerWrapClass}>{content}</dl>
    </div>
  );
};

export default EligibleIssuesWidget;
