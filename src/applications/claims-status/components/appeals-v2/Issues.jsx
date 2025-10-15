import React from 'react';
import PropTypes from 'prop-types';
import titleCase from 'platform/utilities/data/titleCase';
import { pluralize } from '~/platform/utilities/ui';

const Issues = ({ issues, appealType }) => {
  const hasNoDescription = issue =>
    issue.description === null || issue.description === '';

  const open = issues.filter(i => i.status === 'open');
  const remand = issues.filter(i => i.status === 'remand');
  const granted = issues.filter(i => i.status === 'granted');
  const denied = issues.filter(i => i.status === 'denied');
  const withdrawn = issues.filter(i => i.status === 'withdrawn');
  /*
  Filter out issues with no description so that we can
  display the amount of issues without a description
  */
  const openNoDescription = open.filter(hasNoDescription);
  const remandNoDescription = remand.filter(hasNoDescription);
  const grantedNoDescription = granted.filter(hasNoDescription);
  const deniedNoDescription = denied.filter(hasNoDescription);
  const withdrawnNoDescription = withdrawn.filter(hasNoDescription);
  const isAppeal = appealType === 'appeal' || appealType === 'legacy appeal';

  const getListItems = (item, i) => {
    if (hasNoDescription(item)) {
      return null;
    }
    return (
      <li
        className="issue-item"
        key={`${item.status}-${i}`}
        data-dd-privacy="mask"
        data-dd-action-name="appeal issues"
      >
        {item.description}
      </li>
    );
  };
  // Add a list item that displays the amount of issues without a description
  const getNoDescriptionItems = (count, status) => (
    <li
      className="issue-item"
      key={`missing-description-items-${status}`}
      data-dd-privacy="mask"
      data-dd-action-name="missing description items"
    >
      {`We're unable to show ${count} ${pluralize(count, 'issue')} on ${
        isAppeal ? 'appeal' : `your ${titleCase(appealType)}`
      }`}
    </li>
  );

  const openListItems = open.map(getListItems);
  const remandListItems = remand.map(getListItems);
  const grantedListItems = granted.map(getListItems);
  const deniedListItems = denied.map(getListItems);
  const withdrawnListItems = withdrawn.map(getListItems);

  const openSection = openListItems.length ? (
    <ul>
      {openListItems}
      {openNoDescription.length > 0 &&
        getNoDescriptionItems(openNoDescription.length, 'open')}
    </ul>
  ) : null;

  let remandSection = null;
  if (remandListItems.length) {
    remandSection = (
      <div className="remand-section">
        <h4 className="vads-u-font-size--h5">Remand</h4>
        <ul>
          {remandListItems}
          {remandNoDescription.length > 0 &&
            getNoDescriptionItems(remandNoDescription.length, 'remand')}
        </ul>
      </div>
    );
  }

  let grantedSection = null;
  if (grantedListItems.length) {
    grantedSection = (
      <div className="granted-section">
        <h4 className="vads-u-font-size--h5">Granted</h4>
        <ul>
          {grantedListItems}
          {grantedNoDescription.length > 0 &&
            getNoDescriptionItems(grantedNoDescription.length, 'granted')}
        </ul>
      </div>
    );
  }

  let deniedSection = null;
  if (deniedListItems.length) {
    deniedSection = (
      <div className="denied-section">
        <h4 className="vads-u-font-size--h5">Denied</h4>
        <ul>
          {deniedListItems}
          {deniedNoDescription.length > 0 &&
            getNoDescriptionItems(deniedNoDescription.length, 'denied')}
        </ul>
      </div>
    );
  }

  let withdrawnSection = null;
  if (withdrawnListItems.length) {
    withdrawnSection = (
      <div className="withdrawn-section">
        <h4 className="vads-u-font-size--h5">Withdrawn</h4>
        <ul>
          {withdrawnListItems}
          {withdrawnNoDescription.length > 0 &&
            getNoDescriptionItems(withdrawnNoDescription.length, 'withdrawn')}
        </ul>
      </div>
    );
  }

  let activeItems = null;
  if (openListItems.length || remandListItems.length) {
    // Active panel should always render as expanded by default (when items present)
    activeItems = (
      <va-accordion-item open>
        <h3 slot="headline">
          {`Currently on ${isAppeal ? 'appeal' : 'review'}`}
        </h3>
        {openSection}
        {remandSection}
      </va-accordion-item>
    );
  }

  let closedItems = null;
  if (
    grantedListItems.length ||
    deniedListItems.length ||
    withdrawnListItems.length
  ) {
    // Closed panel should render as expanded by default only if no active panel present
    closedItems = (
      <va-accordion-item open={!activeItems}>
        <h3 slot="headline">Closed</h3>
        {grantedSection}
        {deniedSection}
        {withdrawnSection}
      </va-accordion-item>
    );
  }

  return (
    <div className="issues-container">
      <h2>Issues</h2>
      {isAppeal && (
        <va-additional-info
          class="vads-u-margin-bottom--3"
          trigger="Issues may be different from what you identified on your Board Appeal request"
        >
          <div>
            The wording of the issues listed on this page is generated by our
            system. It may look different than the way you identified the issues
            on your Board Appeal request (VA Form 10182). The ultimate
            determination of which issues are properly on appeal will be made by
            a Veterans Law Judge based on careful review of the record and those
            issues will be clearly identified in the Board decision on your
            appeal.
          </div>
        </va-additional-info>
      )}
      <va-accordion bordered open-single>
        {activeItems}
        {closedItems}
      </va-accordion>
    </div>
  );
};

Issues.propTypes = {
  appealType: PropTypes.string.isRequired,
  issues: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.oneOf([
        'open',
        'remand',
        'granted',
        'denied',
        'withdrawn',
      ]).isRequired,
      description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.oneOf([null]),
      ]).isRequired,
    }),
  ).isRequired,
};

export default Issues;
