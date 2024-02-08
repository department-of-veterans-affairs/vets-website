import React from 'react';
import PropTypes from 'prop-types';

const Issues = ({ issues, isAppeal }) => {
  const open = issues.filter(i => i.status === 'open');
  const remand = issues.filter(i => i.status === 'remand');
  const granted = issues.filter(i => i.status === 'granted');
  const denied = issues.filter(i => i.status === 'denied');
  const withdrawn = issues.filter(i => i.status === 'withdrawn');

  const getListItems = (item, i) => (
    <li key={`${item.status}-${i}`}>{item.description}</li>
  );

  const openListItems = open.map(getListItems);
  const remandListItems = remand.map(getListItems);
  const grantedListItems = granted.map(getListItems);
  const deniedListItems = denied.map(getListItems);
  const withdrawnListItems = withdrawn.map(getListItems);

  const openSection = openListItems.length ? <ul>{openListItems}</ul> : null;

  let remandSection = null;
  if (remandListItems.length) {
    remandSection = (
      <div className="remand-section">
        <h4 className="vads-u-font-size--h5">Remand</h4>
        <ul>{remandListItems}</ul>
      </div>
    );
  }

  let grantedSection = null;
  if (grantedListItems.length) {
    grantedSection = (
      <div className="granted-section">
        <h4 className="vads-u-font-size--h5">Granted</h4>
        <ul>{grantedListItems}</ul>
      </div>
    );
  }

  let deniedSection = null;
  if (deniedListItems.length) {
    deniedSection = (
      <div className="denied-section">
        <h4 className="vads-u-font-size--h5">Denied</h4>
        <ul>{deniedListItems}</ul>
      </div>
    );
  }

  let withdrawnSection = null;
  if (withdrawnListItems.length) {
    withdrawnSection = (
      <div className="withdrawn-section">
        <h4 className="vads-u-font-size--h5">Withdrawn</h4>
        <ul>{withdrawnListItems}</ul>
      </div>
    );
  }

  let activeItems = null;
  if (openListItems.length || remandListItems.length) {
    // Active panel should always render as expanded by default (when items present)
    activeItems = (
      <va-accordion-item open uswds="false">
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
      <va-accordion-item open={!activeItems} uswds="false">
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
      <va-accordion bordered open-single uswds="false">
        {activeItems}
        {closedItems}
      </va-accordion>
    </div>
  );
};

Issues.propTypes = {
  isAppeal: PropTypes.bool.isRequired,
  issues: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.oneOf([
        'open',
        'remand',
        'granted',
        'denied',
        'withdrawn',
      ]).isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Issues;
