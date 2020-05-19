// Node modules.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ssoe } from 'platform/user/authentication/selectors';
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
    }),
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
      dismissed,
    } = this.props;

    // Dismiss announcement.
    this.props.dismissAnnouncement(announcementName, showEverytime);

    // Dismiss each related announcement.
    relatedAnnouncements
      .filter(
        relatedAnnouncementName => !dismissed.includes(relatedAnnouncementName),
      )
      .forEach(relatedAnnouncementName => {
        this.props.dismissAnnouncement(relatedAnnouncementName);
      });
  };

  render() {
    const { dismiss } = this;
    const { announcement, profile } = this.props;

    // Do not render if there's no announcement.
    if (!announcement) {
      return <div />;
    }

    return (
      <announcement.component
        announcement={announcement}
        dismiss={dismiss}
        isLoggedIn={this.props.isLoggedIn}
        useSSOe={this.props.useSSOe}
        profile={profile}
      />
    );
  }
}

const mapStateToProps = state => ({
  announcement: selectAnnouncement(state),
  isLoggedIn: isLoggedIn(state),
  profile: selectProfile(state),
  useSSOe: ssoe(state),
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
