import React from 'react';
import PropTypes from 'prop-types';

import DowntimeNotification, {
  externalServices,
  externalServiceStatus,
} from '../../../../platform/monitoring/DowntimeNotification';
import DowntimeApproaching from '../../../../platform/monitoring/DowntimeNotification/components/DowntimeApproaching';
import recordEvent from '../../../../platform/monitoring/record-event';

import Vet360TransactionReporter from '../vet360/containers/TransactionReporter';

import Hero from './Hero';
import ContactInformation from './ContactInformation';
import PersonalInformation from './PersonalInformation';
import MilitaryInformation from './MilitaryInformation';

import IdentityVerification from './IdentityVerification';
import MVIError from './MVIError';

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

  handleDowntime = (downtime, children) => {
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
            render={this.handleDowntime}
            dependencies={[
              externalServices.emis,
              externalServices.vet360,
              externalServices.mvi,
            ]}
          >
            <div>
              <Vet360TransactionReporter />
              <Hero
                fetchHero={fetchHero}
                hero={hero}
                militaryInformation={militaryInformation}
              />
              <ContactInformation />
              <PersonalInformation
                fetchPersonalInformation={fetchPersonalInformation}
                personalInformation={personalInformation}
              />
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
