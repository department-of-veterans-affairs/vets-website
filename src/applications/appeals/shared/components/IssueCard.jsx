import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SELECTED } from '../constants';
import '../definitions';
import { IssueCardContent } from './IssueCardContent';
import BasicLink from './web-component-wrappers/BasicLink';

/**
 * If the issue has activeReview: true and a titleOfActiveReview as 'Supplemental Claim',
 * the issue is under active review for SC (we will eventually support all 3 DR apps).
 * @param {ContestableIssueItem|AdditionalIssueItem} item
 */
export const determineActiveReview = item => {
  const { activeReview, titleOfActiveReview } = item;

  return activeReview && titleOfActiveReview === 'Supplemental Claim';
  // Use the below line instead to support all 3 DR apps instead of just SC.
  // return activeReview && appName === ACTIVE_REVIEW_TITLES[titleOfActiveReview];
};

/**
 * IssueCard
 * @param {String} id - ID base for form elements
 * @param {Number} index - index of item in list
 * @param {ContestableIssueItem|AdditionalIssueItem} item - issue values
 * @param {Object} options - ui:options
 * @param {func} onChange - onChange callback
 * @param {Boolean} showCheckbox - don't show checkbox on review & submit
 * @param {func} onRemove - remove issue callback
 *  page when not in edit mode
 * @param {Boolean} onReviewPage - When true, list is rendered on review page
 * @param {Boolean} showSeparator - Shows visual separator between blocked and non-blocked issues
 * @return {JSX.Element}
 */
export const IssueCard = ({
  appName,
  id,
  index,
  item = {},
  options = {},
  onChange,
  showCheckbox,
  onRemove,
  showSeparator = false,
}) => {
  if (!item) {
    return null;
  }

  // On the review & submit page, there may be more than one
  // of these components in edit mode with the same content, e.g. 526
  // ratedDisabilities & unemployabilityDisabilities causing
  // duplicate input ids/names... an `appendId` value is added to the
  // ui:options
  const appendId = options.appendId ? `_${options.appendId}` : '';
  const elementId = `${id}_${index}${appendId}`;
  const itemIsSelected = item[SELECTED];
  const isEditable = !!item.issue;
  const issueName = item.issue || item.ratingIssueSubjectText;
  const isBlocked = item.isBlocked || false;
  const isActiveReview = determineActiveReview(item);

  const wrapperClass = [
    'widget-wrapper',
    isEditable ? 'additional-issue' : '',
    showCheckbox ? '' : 'checkbox-hidden',
    'vads-u-padding-top--2',
    'vads-u-margin-bottom--0',
    isBlocked && index > 0 ? 'vads-u-margin-top--5' : '',
    // Remove border for blocked issues; add border for first selectable issues
    isBlocked
      ? ''
      : 'vads-u-border-bottom--1px vads-u-border-color--gray-light',
    showSeparator
      ? 'vads-u-border-top--1px vads-u-border-color--gray-medium vads-u-margin-top--4'
      : '',
  ].join(' ');

  const titleClass = [
    'widget-title',
    'dd-privacy-hidden',
    'vads-u-font-weight--bold',
    'vads-u-font-family--serif',
    'vads-u-line-height--2',
    'vads-u-margin--0',
    'capitalize',
    'overflow-wrap-word',
  ].join(' ');

  const removeButtonClass = [
    'remove-issue',
    'vads-u-width--auto',
    'vads-u-margin-left--2',
    'vads-u-margin-top--0',
  ].join(' ');

  const handlers = {
    onRemove: event => {
      event.preventDefault();
      onRemove(index);
    },
    onChange: event => onChange(index, event),
  };

  const editControls =
    showCheckbox && isEditable ? (
      <div className="vads-u-margin-bottom--1">
        <BasicLink
          disable-analytics
          path="/add-issue"
          search={`?index=${index}`}
          className="edit-issue-link"
          aria-label={`Edit ${issueName}`}
          text="Edit"
        />
        <va-button
          secondary
          class={removeButtonClass}
          label={`remove ${issueName}`}
          onClick={handlers.onRemove}
          text="Remove"
        />
      </div>
    ) : null;

  const activeReviewMessage = isActiveReview ? (
    <va-alert class="vads-u-margin-top--0p5" slim status="info" visible>
      <p className="vads-u-margin-top--0">
        {issueName} is part of an active {appName}. Submitting it again may
        delay your decision.
      </p>
      <va-link
        text="Check your claim status"
        href="/claim-or-appeal-status/"
        external
      />
    </va-alert>
  ) : null;

  const sharedCardContent = (
    <>
      <IssueCardContent id={`issue-${index}-description`} {...item} />
      {editControls}
    </>
  );

  return (
    <li id={`issue-${index}`} name={`issue-${index}`} key={index}>
      <div className={wrapperClass}>
        {showCheckbox ? (
          <VaCheckbox
            checked={itemIsSelected}
            data-dd-action-name="Issue Name"
            id={elementId}
            label={issueName}
            name={elementId}
            onVaChange={handlers.onChange}
          >
            <div slot="internal-description">
              {activeReviewMessage}
              <div className="vads-u-padding-right--3">{sharedCardContent}</div>
              <IssueCardContent id={`issue-${index}-description`} {...item} />
              {editControls}
            </div>
          </VaCheckbox>
        ) : (
          <div
            className={isBlocked ? 'vads-u-margin-left--4' : ''}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex="0"
          >
            <strong
              className={titleClass}
              data-dd-action-name="rated issue name"
            >
              {issueName}
            </strong>
            {sharedCardContent}

            <IssueCardContent id={`issue-${index}-description`} {...item} />
            {editControls}
          </div>
        )}
      </div>
    </li>
  );
};


