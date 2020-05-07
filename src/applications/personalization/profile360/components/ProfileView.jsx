import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

import DowntimeNotification, {
  externalServices,
  externalServiceStatus,
} from 'platform/monitoring/DowntimeNotification';
import DowntimeApproaching from 'platform/monitoring/DowntimeNotification/components/DowntimeApproaching';
import recordEvent from 'platform/monitoring/record-event';

import Vet360TransactionReporter from 'vet360/containers/Vet360TransactionReporter';

import Hero from './Hero';
import ContactInformation from './ContactInformation';
import PersonalInformation from './PersonalInformation';
import MilitaryInformation from './MilitaryInformation';
import PaymentInformationBlocked from './PaymentInformationBlocked';
import PaymentInformation from '../containers/PaymentInformation';
import PaymentInformationTOCItem from '../containers/PaymentInformationTOCItem';

import IdentityVerification from './IdentityVerification';
import MVIError from './MVIError';

import {
  directDepositIsSetUp,
  directDepositAddressIsSetUp,
  directDepositIsBlocked as directDepositIsBlockedSelector,
  profileShowReceiveTextNotifications,
} from 'applications/personalization/profile360/selectors';

const ProfileTOC = ({ militaryInformation, showDirectDepositLink }) => (
  <>
    <h2 className="vads-u-font-size--h3">On this page</h2>
    <ul>
      <li>
        <a href="#contact-information">Contact information</a>
      </li>
      {showDirectDepositLink && <PaymentInformationTOCItem />}
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
      directDepositIsBlocked,
      showDirectDepositLink,
      showReceiveTextNotifications,
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
              {/* Breadcrumbs */}
              <Breadcrumbs className="medium-screen:vads-u-padding-y--2">
                <a href="/">Home</a>
                <a href="/">Your profile</a>
              </Breadcrumbs>

              <Vet360TransactionReporter />
              {directDepositIsBlocked && <PaymentInformationBlocked />}
              <Hero
                fetchHero={fetchHero}
                hero={hero}
                militaryInformation={militaryInformation}
              />
              <ProfileTOC
                militaryInformation={militaryInformation}
                showDirectDepositLink={showDirectDepositLink}
              />
              <div id="contact-information" />
              <ContactInformation
                showReceiveTextNotifications={showReceiveTextNotifications}
              />
              <>
                <div id="direct-deposit" />
                <PaymentInformation />
              </>
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

function mapStateToProps(state) {
  const directDepositIsBlocked = directDepositIsBlockedSelector(state);
  return {
    directDepositIsBlocked,
    showDirectDepositLink:
      !directDepositIsBlocked &&
      (directDepositIsSetUp(state) || directDepositAddressIsSetUp(state)),
    showReceiveTextNotifications: profileShowReceiveTextNotifications(state),
  };
}

export default connect(mapStateToProps)(ProfileView);

export { ProfileView };
