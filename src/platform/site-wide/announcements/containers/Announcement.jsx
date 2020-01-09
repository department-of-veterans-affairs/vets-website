// Node modules.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Relative imports.
import { isLoggedIn, selectProfile } from '../../../user/selectors';
import { selectAnnouncement } from '../selectors';
import { initDismissedAnnouncements, dismissAnnouncement } from '../actions';

export class Announcement extends Component {
  static propTypes = {
    // From mapStateToProps.
    announcement: PropTypes.shape({
      name: PropTypes.string.isRequired,
      showEverytime: PropTypes.bool,
      relatedAnnouncements: PropTypes.array,
    }).isRequired,
    dismissed: PropTypes.array,
    isLoggedIn: PropTypes.bool,
    profile: PropTypes.object,
    // From mapDispatchToProps.
    dismissAnnouncement: PropTypes.func.isRequired,
    initDismissedAnnouncements: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.initDismissedAnnouncements();
  }

  dismiss = () => {
    const {
      announcement: {
        name: announcementName,
        showEverytime = false,
        relatedAnnouncements = [],
      },
      dismissAnnouncement,
      dismissed,
    } = this.props;

    // Dismiss announcement.
    dismissAnnouncement(announcementName, showEverytime);

    // Dismiss each related announcement.
    relatedAnnouncements
      .filter(
        relatedAnnouncementName =>
          !dismissed.includes(relatedAnnouncementName),
      )
      .forEach(relatedAnnouncementName => {
        dismissAnnouncement(relatedAnnouncementName);
      });
  };

  render() {
    const { dismiss } = this;
    const { announcement, isLoggedIn, profile } = this.props;

    // Do not render if there's no announcement.
    if (!announcement) {
      return <div />;
    }

    return (
      <announcement.component
        announcement={announcement}
        dismiss={dismiss}
        isLoggedIn={isLoggedIn}
        profile={profile}
      />
    );
  }
}

const mapStateToProps = state => ({
  announcement: selectAnnouncement(state),
  isLoggedIn: isLoggedIn(state),
  profile: selectProfile(state),
  ...state.announcements,
});

const mapDispatchToProps = {
  dismissAnnouncement,
  initDismissedAnnouncements,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Announcement);
