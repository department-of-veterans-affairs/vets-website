import React from 'react';
import { some } from 'lodash';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import moment from 'moment';
import LoadFail from './LoadFail';
import LoadingSection from './LoadingSection';
import { handleDowntimeForSection } from './DowntimeBanner';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import recordEvent from 'platform/monitoring/record-event';
import facilityLocator from 'applications/facility-locator/manifest.json';

class MilitaryInformationContent extends React.Component {
  componentDidMount() {
    this.props.fetchMilitaryInformation();
  }
  renderContent = () => {
    const {
      serviceHistory: { serviceHistory, error },
    } = this.props.militaryInformation;

    if (error) {
      if (some(error.errors, ['code', '403'])) {
        return (
          <AlertBox
            isVisible
            status="warning"
            headline="We can’t access your military information"
            content={
              <div>
                <p>
                  We’re sorry. We can’t find your Department of Defense (DoD)
                  ID. We need this to access your military service records.
                  Please call us at 800-827-1000, or visit your nearest VA
                  regional office and request to be added to the Defense
                  Enrollment Eligibility Reporting System (DEERS).
                </p>
                <a href={facilityLocator.rootUrl}>
                  Find your nearest VA regional office
                </a>
                .
              </div>
            }
          />
        );
      } else if (some(error.errors, e => ['500', '503'].includes(e.code))) {
        return <LoadFail information="military" />;
      }
    }

    if (serviceHistory.length === 0) {
      return (
        <AlertBox
          isVisible
          status="warning"
          headline="We can’t access your military information"
          content={
            <p>
              We’re sorry. We can’t access your military service records. If you
              think you should be able to view your service information here,
              please file a request to change or correct your DD214 or other
              military records.
            </p>
          }
        />
      );
    }

    return (
      <div data-field-name="serviceHistory">
        {serviceHistory.map((service, index) => (
          <div key={index}>
            <h3>{service.branchOfService}</h3>
            <div>
              {moment(service.beginDate).format('MMM D, YYYY')} &ndash;{' '}
              {moment(service.endDate).format('MMM D, YYYY')}
            </div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    return (
      <div>
        <AdditionalInfo
          triggerText="What if my military service information doesn't look right?"
          onClick={() => {
            recordEvent({
              event: 'profile-navigation',
              'profile-action': 'view-link',
              'profile-section': 'update-military-information',
            });
          }}
        >
          <p>
            Some Veterans have reported seeing military service information in
            their VA.gov profiles that doesn’t seem right. When this happens,
            it’s because there’s an error in the information we’re pulling into
            VA.gov from the Defense Enrollment Eligibility Reporting System
            (DEERS).
          </p>
          <p>
            If the military service information in your profile doesn’t look
            right, please call the Defense Manpower Data Center (DMDC). They’ll
            work with you to update your information in DEERS.
          </p>
          <p>
            To reach the DMDC, call 1-800-538-9552, Monday through Friday
            (except federal holidays), 8:00 a.m. to 8:00 p.m. ET. If you have
            hearing loss, call TTY: 1-866-363-2883.
          </p>
        </AdditionalInfo>
        <LoadingSection
          isLoading={!this.props.militaryInformation}
          message="Loading military information..."
          render={this.renderContent}
        />
      </div>
    );
  }
}

export default function MilitaryInformation(props) {
  if (!props.veteranStatus.servedInMilitary) {
    return <div />;
  }

  return (
    <div>
      <h2 className="va-profile-heading" tabIndex="-1">
        Military service
      </h2>
      <DowntimeNotification
        render={handleDowntimeForSection('military service')}
        dependencies={[externalServices.emis]}
      >
        <MilitaryInformationContent {...props} />
      </DowntimeNotification>
    </div>
  );
}
