import React, { useEffect } from 'react';
import { some } from 'lodash';
import { connect } from 'react-redux';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import recordEvent from 'platform/monitoring/record-event';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';
import LoadFail from 'applications/personalization/profile360/components/LoadFail';
import { handleDowntimeForSection } from 'applications/personalization/profile360/components/DowntimeBanner';
import facilityLocator from 'applications/facility-locator/manifest.json';

import ProfileInfoTable from './ProfileInfoTable';
import { transformServiceHistoryEntryIntoTableRow } from '../helpers';

const MilitaryInformationContent = ({ militaryInformation }) => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  const {
    serviceHistory: { serviceHistory, error },
  } = militaryInformation;

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
                We’re sorry. We can’t find your Department of Defense (DoD) ID.
                We need this to access your military service records. Please
                call us at{' '}
                <a
                  href="tel:1-800-827-1000"
                  aria-label="800. 8 2 7. 1000."
                  title="Dial the telephone number 800-827-1000"
                  className="no-wrap"
                >
                  800-827-1000
                </a>
                , or visit your nearest VA regional office and request to be
                added to the Defense Enrollment Eligibility Reporting System
                (DEERS).
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
    <>
      <ProfileInfoTable
        data={serviceHistory}
        dataTransformer={transformServiceHistoryEntryIntoTableRow}
        title="Period of service"
        fieldName="serviceHistory"
        list
      />
      <div className="vads-u-margin-top--4">
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
              aria-label="800. 5 3 8. 9 5 5 2."
              title="Dial the telephone number 800-538-9552"
              className="no-wrap"
            >
              1-800-538-9552
            </a>
            , Monday through Friday (except federal holidays), 8:00 a.m. to 8:00
            p.m. ET. If you have hearing loss, call TTY:{' '}
            <a href="tel:1-866-363-2883" className="no-wrap">
              1-866-363-2883
            </a>
            .
          </p>
        </AdditionalInfo>
      </div>
    </>
  );
};

const MilitaryInformation = ({ militaryInformation }) => (
  <>
    <h2
      tabIndex="-1"
      className="vads-u-line-height--1  vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
      data-focus-target
    >
      Military information
    </h2>
    <DowntimeNotification
      appTitle="Military Information"
      render={handleDowntimeForSection('military service')}
      dependencies={[externalServices.emis]}
    >
      <MilitaryInformationContent militaryInformation={militaryInformation} />
    </DowntimeNotification>
  </>
);

const mapStateToProps = state => ({
  militaryInformation: state.vaProfile?.militaryInformation,
});

export default connect(mapStateToProps)(MilitaryInformation);
