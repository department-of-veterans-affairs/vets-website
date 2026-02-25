import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SELECTED } from '../constants';
import '../definitions';
import { IssueCardContent } from './IssueCardContent';
import BasicLink from './web-component-wrappers/BasicLink';

// It would be better to validate the date based on the app's requirements
// import { isValidDate } from '../validations/date';

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
  id,
  index,
  item = {},
  options = {},
  onChange,
  showCheckbox,
  onRemove,
  showSeparator = false,
}) => {
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

  const wrapperClass = [
    'widget-wrapper',
    isEditable ? 'additional-issue' : '',
    showCheckbox ? '' : 'checkbox-hidden',
    'vads-u-padding-top--2',
    'vads-u-padding-right--3',
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

            <IssueCardContent id={`issue-${index}-description`} {...item} />
            {editControls}
          </div>
        )}
      </div>
    </li>
  );
};

IssueCard.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
  item: PropTypes.shape({
    issue: PropTypes.string,
    decisionDate: PropTypes.string,
    ratingIssueSubjectText: PropTypes.string,
    description: PropTypes.string,
    ratingIssuePercentNumber: PropTypes.string,
    approxDecisionDate: PropTypes.string,
    [SELECTED]: PropTypes.bool,
  }),
  options: PropTypes.shape({
    appendId: PropTypes.string,
  }),
  showCheckbox: PropTypes.bool,
  showSeparator: PropTypes.bool,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
};
