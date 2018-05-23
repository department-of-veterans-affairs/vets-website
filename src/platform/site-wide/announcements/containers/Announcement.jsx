import React from 'react';
import { connect } from 'react-redux';

import { isLoggedIn } from '../../../user/selectors';
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
      announcement
    } = this.props;

    if (announcement) {
      return (
        <announcement.component
          announcement={announcement}
          isLoggedIn={this.props.isLoggedIn}
          dismiss={this.dismiss}/>
      );
    }
    return <div/>;
  }
}

const mapStateToProps = (state) => {
  return {
    announcement: selectAnnouncement(state),
    isLoggedIn: isLoggedIn(state),
    ...state.announcements
  };
};

const mapDispatchToProps = {
  initDismissedAnnouncements,
  dismissAnnouncement
};

export { Announcement };
export default connect(mapStateToProps, mapDispatchToProps)(Announcement);
