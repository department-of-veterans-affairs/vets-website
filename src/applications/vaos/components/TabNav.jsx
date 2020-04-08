import PropTypes from 'prop-types';
import React from 'react';

import TabItem from './TabItem';

class TabNav extends React.Component {
  render() {
    return (
      <ul className="va-tabs vaos-appts__tabs" role="tablist">
        <TabItem
          id="upcoming"
          shortcut={1}
          tabpath="upcoming"
          title="Upcoming appointments"
        />
        <TabItem
          id="past"
          shortcut={2}
          tabpath="past"
          title="Past appointments"
        />
      </ul>
    );
  }
}

TabNav.propTypes = {
  id: PropTypes.string,
};

export default TabNav;
