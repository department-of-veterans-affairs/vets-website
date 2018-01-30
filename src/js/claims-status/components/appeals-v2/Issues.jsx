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
        <h4>Remand</h4>
        <ul>{remandListItems}</ul>
      </div>
    );
  }

  let grantedSection = null;
  if (grantedListItems.length) {
    grantedSection = (
      <div>
        <h4>Granted</h4>
        <ul>{grantedListItems}</ul>
      </div>
    );
  }

  let deniedSection = null;
  if (deniedListItems.length) {
    deniedSection = (
      <div>
        <h4>Denied</h4>
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
    <div>
      <h2>Issues</h2>
      {activeItems}
      {closedItems}
    </div>
  );
};

Issues.propTypes = {
  appeal: PropTypes.shape({
    attributes: PropTypes.shape({
      issues: PropTypes.arrayOf(
        PropTypes.shape({
          active: PropTypes.bool.isRequired,
          description: PropTypes.string.isRequired,
          lastAction: PropTypes.isRequired
        }),
      ),
    }),
  }),
};

export default Issues;
