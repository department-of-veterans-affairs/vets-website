import React, { Component } from 'react';
import { some } from 'lodash';
import { connect } from 'react-redux';
import { fetchMilitaryInformation } from '../../profile360/actions';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import moment from 'moment';
import LoadFail from 'applications/personalization/profile360/components/LoadFail';
import LoadingSection from 'applications/personalization/profile360/components/LoadingSection';
import { handleDowntimeForSection } from 'applications/personalization/profile360/components/DowntimeBanner';
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
                <p>
                  You can also request to be added to DEERS through our online
                  customer help center.
                </p>
                <a href="https://iris.custhelp.va.gov/app/answers/detail/a_id/3036/~/not-registered-in-deers%2C-or-received-and-error-message-while-trying-to">
                  Get instructions from our help center
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
      <table className="militaryInformation" data-field-name="serviceHistory">
        <thead>
          <tr>
            <th>
              <h3>Period of service</h3>
            </th>
          </tr>
        </thead>
        <tbody>
          {serviceHistory.map((service, index) => (
            <tr key={index}>
              <td>
                <h4 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--bold">
                  {service.branchOfService}
                </h4>
              </td>
              <td>
                {moment(service.beginDate).format('MMM D, YYYY')} &ndash;{' '}
                {moment(service.endDate).format('MMM D, YYYY')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  render() {
    return (
      <div>
        <LoadingSection
          isLoading={!this.props.militaryInformation}
          message="Loading military information..."
          render={this.renderContent}
        />
        <AdditionalInfo
          triggerText="What if my military service information doesn’t look right?"
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
            To reach the DMDC, call{' '}
            <a
              href="tel:1-800-538-9552"
              aria-label="8 0 0. 5 3 8. 9 5 5 2."
              title="Dial the telephone number 800-538-9552"
              className="no-wrap"
            >
              1-800-538-9552
            </a>
            , Monday through Friday (except federal holidays), 8:00 a.m. to 8:00
            p.m. ET. If you have hearing loss, call TTY: 1-866-363-2883.
          </p>
        </AdditionalInfo>
      </div>
    );
  }
}

class MilitaryInformation extends Component {
  render() {
    return (
      <div>
        <h2 className="va-profile-heading" tabIndex="-1">
          Military information
        </h2>
        <DowntimeNotification
          render={handleDowntimeForSection('military service')}
          dependencies={[externalServices.emis]}
        >
          <MilitaryInformationContent {...this.props} />
        </DowntimeNotification>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  militaryInformation: state.vaProfile.militaryInformation,
});

const mapDispatchToProps = {
  fetchMilitaryInformation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MilitaryInformation);
