import React from 'react';
import PropTypes from 'prop-types';
import CollapsiblePanel from '../../../common/components/CollapsiblePanel';

const Issues = ({ issues }) => {
  // TO-DO: think about whether it's crazy to run through the issues list 4 times
  const open = issues.filter(i => i.status === 'open');
  const remand = issues.filter(i => i.status === 'remand');
  const granted = issues.filter(i => i.status === 'granted');
  const denied = issues.filter(i => i.status === 'denied');

  const getListItems = (item, i) => {
    return (
      <li key={`${item}-${i}`}>
        {item.description}
      </li>
    );
  };

  const openListItems = open.map(getListItems);
  const remandListItems = remand.map(getListItems);
  const grantedListItems = granted.map(getListItems);
  const deniedListItems = denied.map(getListItems);

  const openSection = (openListItems.length) ? <ul>{openListItems}</ul> : null;

  let remandSection = null;
  if (remandListItems.length) {
    remandSection = (
      <div>
        <h5>Remand</h5>
        <ul>{remandListItems}</ul>
      </div>
    );
  }

  let grantedSection = null;
  if (grantedListItems.length) {
    grantedSection = (
      <div>
        {/* USWDS $color-green */}
        <h5 style={{ color: '#2e8540' }}>Granted</h5>
        <ul>{grantedListItems}</ul>
      </div>
    );
  }

  let deniedSection = null;
  if (deniedListItems.length) {
    deniedSection = (
      <div>
        {/* USWDS $color-secondary (red) */}
        <h5 style={{ color: '#e31c3d' }}>Denied</h5>
        <ul>{deniedListItems}</ul>
      </div>
    );
  }

  let activeItems = null;
  if (openListItems.length || remandListItems.length) {
    activeItems = (
      <CollapsiblePanel panelName={'Currently On Appeal'}>
        {openSection}
        {remandSection}
      </CollapsiblePanel>
    );
  }

  let closedItems = null;
  if (grantedListItems.length || deniedListItems.length) {
    closedItems = (
      <CollapsiblePanel panelName={'Closed'}>
        {grantedSection}
        {deniedSection}
      </CollapsiblePanel>
    );
  }

  return (
    <div className="issues-container">
      <h2>Issues</h2>
      {activeItems}
      {closedItems}
    </div>
  );
};

Issues.propTypes = {
  issues: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.oneOf(['open', 'remand', 'granted', 'denied']).isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Issues;
