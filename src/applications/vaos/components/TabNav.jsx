import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { focusElement } from 'platform/utilities/ui';

import TabItem from './TabItem';

class TabNav extends React.Component {
  render() {
    return (
      <ul className="va-tabs vaos-appts__tabs" role="tablist">
        <TabItem
          id="upcoming"
          tabpath="/"
          isActive={this.props.location.pathname === '/'}
          firstTab
          onNextTab={() => {
            this.props.router.push('/past');
            focusElement('#tabpast');
          }}
          title="Upcoming appointments"
        />
        <TabItem
          id="past"
          tabpath="/past"
          isActive={this.props.location.pathname === '/past'}
          onPreviousTab={() => {
            this.props.router.push('/');
            focusElement('#tabupcoming');
          }}
          title="Past appointments"
        />
      </ul>
    );
  }
}

TabNav.propTypes = {
  id: PropTypes.string,
};

export default withRouter(TabNav);

export { TabNav };
