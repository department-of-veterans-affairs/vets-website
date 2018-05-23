import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import scrollToTop from '../../../../platform/utilities/ui/scrollToTop';

import Hero from './Hero';
import ContactInformation from './ContactInformation';
import PersonalInformation from './PersonalInformation';
import MilitaryInformation from './MilitaryInformation';

class ProfileView extends React.Component {

  componentWillMount() {
    this.props.startup();
  }

  componentDidUpdate(oldProps) {
    if (this.props.profile !== oldProps.profile && this.props.profile.hero && this.props.profile.hero.userFullName) {
      const { first, last } = this.props.profile.hero.userFullName;
      document.title = `Profile: ${first} ${last}`;
    }
    if (this.props.message.content && !oldProps.message.content) {
      scrollToTop();
    }
  }

  renderLOAState() {
    return (
      <div>
        <h1>Verify Your Identity to View Your Profile</h1>
        <p>We need to make sure you’re you—and not someone pretending to be you—before we give you access to your personal and health-related information. This helps to keep your information safe and prevent fraud and identity theft.</p>
        <p><strong>This one-time process takes about 5-10 minutes.</strong></p>

        <div>
          <p><a href="#">How will Vets.gov verify my identity?</a></p>
          <div>
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
            <button className="usa-button-primary va-button-primary" href="/verify">
              <img alt="ID.me" src="/img/signin/idme-icon-white.svg"/><strong> Verify with ID.me</strong>
            </button>
            <h4>What if I’m having trouble verifying my identity?</h4>
            <p><a href="/faq/" target="_blank">Get answers to Frequently Asked Questions</a></p>
            <p>
              Or call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a> (TTY: <a href="tel:18008778339">1-800-877-8339</a>). We’re here Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)
            </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.profile.hero) return <LoadingIndicator message="Loading your profile information..."/>;

    const {
      message,
      profile: {
        hero,
        personalInformation,
        militaryInformation
      }
    } = this.props;

    let content;

    if (this.props.profile.verified) {
      content = (
        <div>
          <AlertBox onCloseAlert={message.clear} isVisible={!!message.content} status="success" content={<h3>{message.content}</h3>}/>
          <Hero hero={hero} militaryInformation={militaryInformation}/>
          <ContactInformation {...this.props}/>
          <PersonalInformation personalInformation={personalInformation}/>
          <MilitaryInformation militaryInformation={militaryInformation}/>
        </div>
      );

    } else {
      content = this.renderLOAState();
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
