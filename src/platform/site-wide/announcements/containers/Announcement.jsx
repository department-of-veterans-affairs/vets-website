import React from 'react';
import { connect } from 'react-redux';

import { selectAnnouncement } from '../selectors';

import {
  initDismissedAnnouncements,
  dismissAnnouncement
} from '../actions';

class Announcement extends React.Component {
  componentDidMount() {
    this.props.initDismissedAnnouncements();
  }
  dismiss = () => {
    const {
      announcement: {
        name: announcementName,
        relatedAnnouncements = []
      }
    } = this.props;

    this.props.dismissAnnouncement(announcementName);
    relatedAnnouncements.forEach(relatedAnnouncementName => this.props.dismissAnnouncement(relatedAnnouncementName));
  }
  render() {
    const {
      announcement,
      user
    } = this.props;

    if (announcement) {
      return (
        <announcement.component
          announcement={announcement}
          user={user}
          dismiss={this.dismiss}/>
      );
    }
    return <div/>;
  }
}

const mapStateToProps = (state) => {
  return {
    announcement: selectAnnouncement(state),
    user: state.user,
    ...state.announcements
  };
};

const mapDispatchToProps = {
  initDismissedAnnouncements,
  dismissAnnouncement
};

export { Announcement };
export default connect(mapStateToProps, mapDispatchToProps)(Announcement);
