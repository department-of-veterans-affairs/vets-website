import React from 'react';
import { connect } from 'react-redux';

import config from '../config';

import {
  initDismissedAnnouncements,
  dismissAnnouncement
} from '../actions';

class Announcement extends React.Component {
  componentDidMount() {
    this.props.initDismissedAnnouncements()
  }
  getRouteData() {
    const path = document.location.pathname;
    return config.routes.find(routeData => routeData.pages.test(path));
  }
  render() {
    const routeData = this.getRouteData();
    if (!routeData) return <div/>
    return <routeData.component {...this.props} {...routeData}/>;
  }
}

const mapStateToProps = (state) => state.announcements;

const mapDispatchToProps = {
  initDismissedAnnouncements,
  dismissAnnouncement
};

export { Announcement };
export default connect(mapStateToProps, mapDispatchToProps)(Announcement);
