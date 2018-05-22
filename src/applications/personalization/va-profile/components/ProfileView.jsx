import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import scrollToTop from '../../../../platform/utilities/ui/scrollToTop';

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
          <Hero fetchHero={fetchHero} hero={hero} militaryInformation={militaryInformation}/>
          <ContactInformation {...this.props}/>
          <PersonalInformation fetchPersonalInformation={fetchPersonalInformation} personalInformation={personalInformation}/>
          <MilitaryInformation fetchMilitaryInformation={fetchMilitaryInformation} militaryInformation={militaryInformation}/>
        </div>
      </div>
    );
  }
}

export default ProfileView;
