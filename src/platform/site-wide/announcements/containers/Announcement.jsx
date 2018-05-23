import React from 'react';
import { connect } from 'react-redux';

import { selectAnnouncement } from '../selectors';

import {
  initDismissedAnnouncements,
  dismissAnnouncement
} from '../actions';

class Announcement extends React.Component {
  componentDidMount() {
    this.props.initDismissedAnnouncements()
  }
  dismiss = () => {
    console.log(this)
    this.props.dismissAnnouncement(this.props.announcement.name);
  }
  render() {
    const announcement = this.props.announcement;
    if (announcement) {
      return <announcement.component announcement={announcement} dismiss={this.dismiss}/>;
    }
    return <div/>;
  }
}

const mapStateToProps = (state) => {
  return {
    announcement: selectAnnouncement(state),
    ...state.announcements
  };
};

const mapDispatchToProps = {
  initDismissedAnnouncements,
  dismissAnnouncement
};

export { Announcement };
export default connect(mapStateToProps, mapDispatchToProps)(Announcement);
