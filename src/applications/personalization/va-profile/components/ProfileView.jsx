import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import scrollToTop from '../../../../platform/utilities/ui/scrollToTop';

import {
  FETCH_VA_PROFILE_FAIL
} from '../actions';

import Hero from './Hero';
import ContactInformation from './ContactInformation';
import PersonalInformation from './PersonalInformation';
import MilitaryInformation from './MilitaryInformation';

class ProfileView extends React.Component {

  componentWillMount() {
    this.props.startup();
  }

  componentDidUpdate(oldProps) {
    if (this.props.profile !== oldProps.profile && this.props.profile.userFullName) {
      const { first, last } = this.props.profile.userFullName;
      document.title = `Profile: ${first} ${last}`;
    }
    if (this.props.message.content && !oldProps.message.content) {
      scrollToTop();
    }
  }

  render() {
    if (this.props.profile.loading) {
      return <LoadingIndicator message="Loading complete profile..."/>;
    }

    if (this.props.profile.errors.includes(FETCH_VA_PROFILE_FAIL)) {
      return (
        <div className="row">
          <AlertBox status="error" isVisible
            content={<h4 className="usa-alert-heading">Failed to load VA Profile</h4>}/>
        </div>
      );
    }

    const {
      message,
      profile: {
        userFullName,
        personalInformation,
        serviceHistory
      }
    } = this.props;

    return (
      <div className="va-profile-wrapper row" style={{ marginBottom: 35 }}>
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <AlertBox onCloseAlert={message.clear} isVisible={!!message.content} status="success" content={<h3>{message.content}</h3>}/>
          <Hero userFullName={userFullName} serviceHistoryResponseData={serviceHistory}/>
          <ContactInformation {...this.props}/>
          <PersonalInformation personalInformation={personalInformation}/>
          <MilitaryInformation serviceHistoryResponseData={serviceHistory}/>
        </div>
      </div>
    );
  }
}

export default ProfileView;
