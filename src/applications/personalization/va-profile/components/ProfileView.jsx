import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import scrollToTop from '../../../../platform/utilities/ui/scrollToTop';
import DowntimeNotification, { services, serviceStatus } from '../../../../platform/monitoring/DowntimeNotification';

import Hero from './Hero';
import ContactInformation from './ContactInformation';
import PersonalInformation from './PersonalInformation';
import MilitaryInformation from './MilitaryInformation';

class ProfileView extends React.Component {

  componentDidUpdate(oldProps) {
    if (this.props.profile !== oldProps.profile && this.props.profile.hero && this.props.profile.hero.userFullName) {
      const { first, last } = this.props.profile.hero.userFullName;
      document.title = `Profile: ${first} ${last}`;
    }
    if (this.props.message.content && !oldProps.message.content) {
      scrollToTop();
    }
  }

  renderDowntimeComponent = (title) => {
    return (downtime, children) => {
      if (downtime.status === serviceStatus.down) {
        return (
          <AlertBox
            status="warning"
            isVisible
            content={
              <div>
                <h3>We can’t show your {title} information right now.</h3>
                <p>We’re sorry. The system that handles {title} information is down for maintenance right now. We hope to be finished with our work by {downtime.startTime.format('MMMM Do')}, {downtime.endTime.format('LT')}. Please check back soon.</p>
              </div>
            }/>
        );
      }
      return children;
    };
  }

  render() {
    const {
      fetchMilitaryInformation,
      fetchHero,
      fetchPersonalInformation,
      message,
      profile: {
        hero,
        personalInformation,
        militaryInformation
      }
    } = this.props;

    return (
      <div className="va-profile-wrapper row" style={{ marginBottom: 35 }}>
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <AlertBox onCloseAlert={message.clear} isVisible={!!message.content} status="success" content={<h3>{message.content}</h3>}/>

          <DowntimeNotification dependencies={[services.mvi]} render={this.renderDowntimeComponent('basic')}>
            <Hero fetchHero={fetchHero} hero={hero} militaryInformation={militaryInformation}/>
          </DowntimeNotification>

          <h2 className="va-profile-heading">Contact Information</h2>
          <DowntimeNotification dependencies={[services.evss, services.mvi]} render={this.renderDowntimeComponent('contact')}>
            <ContactInformation {...this.props}/>
          </DowntimeNotification>

          <h2 className="va-profile-heading">Personal Information</h2>
          <DowntimeNotification dependencies={[services.mvi]} render={this.renderDowntimeComponent('personal')}>
            <PersonalInformation fetchPersonalInformation={fetchPersonalInformation} personalInformation={personalInformation}/>
          </DowntimeNotification>

          <h2 className="va-profile-heading">Military Service</h2>
          <DowntimeNotification dependencies={[services.emis]} render={this.renderDowntimeComponent('contact')}>
            <MilitaryInformation fetchMilitaryInformation={fetchMilitaryInformation} militaryInformation={militaryInformation}/>
          </DowntimeNotification>
        </div>
      </div>
    );
  }
}

export default ProfileView;
