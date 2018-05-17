import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
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

    // @todo update this now that the props shape changed
    if (this.props.profile !== oldProps.profile && this.props.profile.userFullName) {
      const { first, last } = this.props.profile.userFullName;
      document.title = `Profile: ${first} ${last}`;
    }
    if (this.props.message.content && !oldProps.message.content) {
      scrollToTop();
    }
  }

  render() {
    if (!this.props.profile.isReady) return <h1>Loading...</h1>;

    const {
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
          <Hero hero={hero} militaryInformation={militaryInformation}/>
          <ContactInformation {...this.props}/>
          <PersonalInformation personalInformation={personalInformation}/>
          <MilitaryInformation militaryInformation={militaryInformation}/>
        </div>
      </div>
    );
  }
}

export default ProfileView;
