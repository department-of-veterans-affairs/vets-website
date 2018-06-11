import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

import DowntimeNotification, { services, serviceStatus } from '../../../../platform/monitoring/DowntimeNotification';
import DowntimeApproaching from '../../../../platform/monitoring/DowntimeNotification/components/DowntimeApproaching';
import scrollToTop from '../../../../platform/utilities/ui/scrollToTop';
import recordEvent from '../../../../platform/monitoring/record-event';

import Hero from './Hero';
import ContactInformation from './ContactInformation';
import PersonalInformation from './PersonalInformation';
import MilitaryInformation from './MilitaryInformation';

function IncreaseLOAPrompt() {
  return (
    <div>
      <h1>Verify Your Identity to View Your Profile</h1>
      <p>We need to make sure you’re you—and not someone pretending to be you—before we give you access to your personal and health-related information. This helps to keep your information safe and prevent fraud and identity theft.</p>
      <p><strong>This one-time process takes about 5-10 minutes.</strong></p>

      <div>
        <div onClick={() => { recordEvent({ event: 'profile-navigation', 'profile-action': 'view-link', 'additional-info': 'learn-more-identity' }); }}>
          <AdditionalInfo triggerText="How will Vets.gov verify my identity?">
            <p>We use ID.me, our Veteran-owned technology partner that provides the strongest identity verification system available to prevent fraud and identity theft.</p>
            <p><strong>To verify your identity, you’ll need both of these:</strong>
              <ul>
                <li>A smartphone (or a landline or mobile phone and a computer with an Internet connection), <strong>and</strong></li>
                <li>Your Social Security number</li>
              </ul>
            </p>
            <p><strong>You’ll also need one of these:</strong>
              <ul>
                <li>A digital image of your driver’s license or passport, <strong>or</strong></li>
                <li>The ability to answer certain questions based on private and public data (like your credit report or mortgage history) to prove you’re you</li>
              </ul>
            </p>
          </AdditionalInfo>
        </div>
        <br/>
        <a className="usa-button-primary va-button-primary" href="/verify" onClick={() => { recordEvent({ event: 'verify-link-clicked' });}}>
          <img alt="ID.me" src="/img/signin/idme-icon-white.svg"/><strong> Verify with ID.me</strong>
        </a>
        <h4>What if I’m having trouble verifying my identity?</h4>
        <p><a href="/faq/" target="_blank" onClick={() => { recordEvent({ event: 'profile-navigation', 'profile-action': 'view-link', 'profile-section': 'vets-faqs' }); }}>Get answers to Frequently Asked Questions</a></p>
        <p>
          Or call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a> (TTY: <a href="tel:18008778339">1-800-877-8339</a>). We’re here Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)
        </p>
      </div>
    </div>
  );
}

function MVIError() {
  return (
    <div>
      <h1>Your Profile</h1>
      <h4>We’re having trouble matching your information to our Veteran records</h4>
      <p>We’re sorry. We’re having trouble matching your information to our Veteran records, so we can’t give you access to tools for managing your health and benefits.</p>

      <p>If you’d like to use these tools on Vets.gov, please contact your nearest VA medical center. Let them know you need to verify the information in your records, and update it as needed. The operator, or a patient advocate, can connect with you with the right person who can help.</p>

      <p><a href="/facilities/" onClick={() => { recordEvent({ event: 'profile-navigation', 'profile-action': 'view-link', 'profile-section': 'find-center' }); }}>Find your nearest VA Medical Center</a>.</p>
    </div>
  );
}

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

  handleDowntime = (downtime, children) => {
    if (downtime.status === serviceStatus.downtimeApproaching) {
      return (
        <DowntimeApproaching
          {...downtime}
          {...this.props.downtimeData}
          messaging={{
            title: <h3>Some parts of the profile will be down for maintenance soon</h3>
          }}
          content={children}/>
      );
    }
    return children;
  }

  render() {
    const {
      user,
      fetchMilitaryInformation,
      fetchHero,
      fetchPersonalInformation,
      message,
      profile: {
        hero,
        personalInformation,
        militaryInformation
      },
      downtimeData: {
        appTitle
      }
    } = this.props;

    let content;

    if (user.profile.verified) {
      if (user.profile.status === 'OK') {
        content = (
          <DowntimeNotification appTitle={appTitle} render={this.handleDowntime} dependencies={[services.emis, services.evss, services.mvi]}>
            <div>
              <AlertBox onCloseAlert={message.clear} isVisible={!!message.content} status="success" content={<h3>{message.content}</h3>}/>
              <Hero fetchHero={fetchHero} hero={hero} militaryInformation={militaryInformation}/>
              <ContactInformation {...this.props}/>
              <PersonalInformation fetchPersonalInformation={fetchPersonalInformation} personalInformation={personalInformation}/>
              <MilitaryInformation fetchMilitaryInformation={fetchMilitaryInformation} militaryInformation={militaryInformation}/>
            </div>
          </DowntimeNotification>
        );
      } else {
        content = <MVIError/>;
      }
    } else {
      content = <IncreaseLOAPrompt/>;
    }

    return (
      <div className="va-profile-wrapper row" style={{ marginBottom: 35 }}>
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          {content}
        </div>
      </div>
    );
  }
}

export default ProfileView;
