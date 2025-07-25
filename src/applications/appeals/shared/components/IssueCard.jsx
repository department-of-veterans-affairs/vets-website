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
  onReviewPage,
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

  const wrapperClass = [
    'widget-wrapper',
    isEditable ? 'additional-issue' : '',
    showCheckbox ? '' : 'checkbox-hidden',
    'vads-u-padding-top--2',
    'vads-u-padding-right--3',
    'vads-u-margin-bottom--0',
    'vads-u-border-bottom--1px',
    'vads-u-border-color--gray-light',
  ].join(' ');

  const titleClass = [
    'widget-title',
    'dd-privacy-hidden',
    'vads-u-font-size--h4',
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
          uswds
        />
      </div>
    ) : null;

  // Issues h4 disappears in edit mode, so we need to match the page header
  // level
  const Header = onReviewPage ? 'h5' : 'h4';

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
          <>
            <Header
              className={titleClass}
              data-dd-action-name="rated issue name"
            >
              <strong>{issueName}</strong>
            </Header>
            <IssueCardContent id={`issue-${index}-description`} {...item} />
            {editControls}
          </>
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
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
