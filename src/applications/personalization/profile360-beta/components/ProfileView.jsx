import React from 'react';
import PropTypes from 'prop-types';

import DowntimeNotification, {
  externalServices,
  externalServiceStatus,
} from 'platform/monitoring/DowntimeNotification';
import DowntimeApproaching from 'platform/monitoring/DowntimeNotification/components/DowntimeApproaching';
import recordEvent from 'platform/monitoring/record-event';

import Vet360TransactionReporter from 'vet360/containers/TransactionReporter';

import Hero from '@profile360/components/Hero';
import ContactInformation from '@profile360/components/ContactInformation';
import PersonalInformation from '@profile360/components/PersonalInformation';
import MilitaryInformation from '@profile360/components/MilitaryInformation';
import PaymentInformation from '@profile360/containers/PaymentInformation';
import PaymentInformationTOCItem from '@profile360/containers/PaymentInformationTOCItem';

import IdentityVerification from '@profile360/components/IdentityVerification';
import MVIError from '@profile360/components/MVIError';

const ProfileTOC = ({ militaryInformation }) => (
  <>
    <h2 className="vads-u-font-size--h3">On this page</h2>
    <ul>
      <li>
        <a href="#contact-information">Contact information</a>
      </li>
      <PaymentInformationTOCItem />
      <li>
        <a href="#personal-information">Personal information</a>
      </li>
      {militaryInformation && (
        <li>
          <a href="#military-information">Military service information</a>
        </li>
      )}
    </ul>
  </>
);

class ProfileView extends React.Component {
  static propTypes = {
    downtimeData: PropTypes.object,
    fetchMilitaryInformation: PropTypes.func.isRequired,
    fetchHero: PropTypes.func.isRequired,
    fetchPersonalInformation: PropTypes.func.isRequired,
    profile: PropTypes.shape({
      hero: PropTypes.object,
      personalInformation: PropTypes.object,
      militaryInformation: PropTypes.object,
    }),
    user: PropTypes.object,
  };

  handleDowntimeApproaching = (downtime, children) => {
    if (downtime.status === externalServiceStatus.downtimeApproaching) {
      return (
        <DowntimeApproaching
          {...downtime}
          {...this.props.downtimeData}
          messaging={{
            title: (
              <h3>
                Some parts of the profile will be down for maintenance soon
              </h3>
            ),
          }}
          content={children}
        />
      );
    }
    return children;
  };

  render() {
    const {
      user,
      fetchMilitaryInformation,
      fetchHero,
      fetchPersonalInformation,
      profile: { hero, personalInformation, militaryInformation },
      downtimeData: { appTitle },
    } = this.props;

    let content;

    if (user.profile.verified) {
      if (user.profile.status === 'OK') {
        content = (
          <DowntimeNotification
            appTitle={appTitle}
            render={this.handleDowntimeApproaching}
            dependencies={[
              externalServices.emis,
              externalServices.evss,
              externalServices.mvi,
              externalServices.vet360,
            ]}
          >
            <div>
              <Vet360TransactionReporter />
              <Hero
                fetchHero={fetchHero}
                hero={hero}
                militaryInformation={militaryInformation}
              />
              <ProfileTOC militaryInformation={militaryInformation} />
              <div id="contact-information" />
              <ContactInformation />
              <div id="direct-deposit" />
              <PaymentInformation />
              <div id="personal-information" />
              <PersonalInformation
                fetchPersonalInformation={fetchPersonalInformation}
                personalInformation={personalInformation}
              />
              {militaryInformation && <div id="military-information" />}
              <MilitaryInformation
                veteranStatus={user.profile.veteranStatus}
                fetchMilitaryInformation={fetchMilitaryInformation}
                militaryInformation={militaryInformation}
              />
            </div>
          </DowntimeNotification>
        );
      } else {
        content = (
          <MVIError
            facilitiesClick={() => {
              recordEvent({
                event: 'profile-navigation',
                'profile-action': 'view-link',
                'profile-section': 'find-center',
              });
            }}
          />
        );
      }
    } else {
      content = (
        <IdentityVerification
          learnMoreClick={() => {
            recordEvent({
              event: 'profile-navigation',
              'profile-action': 'view-link',
              'additional-info': 'learn-more-identity',
            });
          }}
          faqClick={() => {
            recordEvent({
              event: 'profile-navigation',
              'profile-action': 'view-link',
              'profile-section': 'vets-faqs',
            });
          }}
          verifyClick={() => {
            recordEvent({ event: 'verify-link-clicked' });
          }}
        />
      );
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
