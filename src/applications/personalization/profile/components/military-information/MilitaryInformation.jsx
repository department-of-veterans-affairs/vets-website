import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { some } from 'lodash';
import { connect } from 'react-redux';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';

import recordEvent from 'platform/monitoring/record-event';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';
import { selectVeteranStatus } from 'platform/user/selectors';
import facilityLocator from 'applications/facility-locator/manifest.json';
import LoadFail from '../alerts/LoadFail';
import { handleDowntimeForSection } from '../alerts/DowntimeBanner';

import Headline from '../ProfileSectionHeadline';
import ProfileInfoTable from '../ProfileInfoTable';
import { transformServiceHistoryEntryIntoTableRow } from '../../helpers';

// Alert to show when a user does not appear to be a Veteran
const NotAVeteranAlert = () => {
  return (
    <>
      <va-alert status="warning">
        <h2 slot="headline">We don’t seem to have your military records</h2>

        <p>
          We’re sorry. We can’t match your information to our records. If you
          think this is an error, please call the VA.gov help desk at{' '}
          <va-telephone contact={CONTACTS.HELP_DESK} /> (TTY:{' '}
          <va-telephone contact={CONTACTS['711']} />
          ). We’re here Monday–Friday, 8:00 a.m.–8:00 p.m. ET.
        </p>
        <p>
          Or you can learn how to{' '}
          <a
            href="https://www.archives.gov/veterans/military-service-records/correct-service-records.html"
            target="blank"
            rel="noopener noreferrer"
          >
            update or correct your military service history
          </a>
          .
        </p>
      </va-alert>
    </>
  );
};

// Alert to show if `GET service_history` returned a 403
const NotInDEERSAlert = () => {
  return (
    <>
      <va-alert status="warning">
        <h2 slot="headline">We can’t access your military information</h2>
        <div>
          <p>
            We’re sorry. We can’t find your Department of Defense (DoD) ID. We
            need this to access your military service records. If you need help
            updating your information in DEERS, please call the Defense Manpower
            Data Center (DMDC).
          </p>
          <p>
            To reach the DMDC, call <va-telephone contact={CONTACTS.DS_LOGON} />
            . This office is open Monday through Friday (except federal
            holidays), 8:00 a.m. to 8:00 p.m. ET. If you have hearing loss, call
            TTY: <va-telephone contact={CONTACTS.DS_LOGON_TTY} />.
          </p>
          <p>Or you can visit your nearest VA regional office for help.</p>
          <a href={facilityLocator.rootUrl}>
            Find your nearest VA regional office
          </a>
          .
        </div>
      </va-alert>
    </>
  );
};

// Alert to show if `GET service_history` returned an empty service history array
const NoServiceHistoryAlert = () => {
  return (
    <>
      <va-alert status="warning">
        <h2 slot="headline">We can’t access your military information</h2>
        <p>
          We’re sorry. We can’t access your military service records. If you
          think you should be able to view your service information here, please
          file a request to change or correct your DD214 or other military
          records.
        </p>
      </va-alert>
    </>
  );
};

const MilitaryInformationContent = ({ militaryInformation, veteranStatus }) => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  const invalidVeteranStatus =
    !veteranStatus?.status || veteranStatus?.status === 'NOT_AUTHORIZED';

  // When the user is not authorized, militaryInformation.serviceHistory is populated with .error
  if (
    invalidVeteranStatus &&
    !militaryInformation?.serviceHistory?.serviceHistory
  ) {
    return <NotAVeteranAlert />;
  }

  const {
    serviceHistory: { serviceHistory, error },
  } = militaryInformation;

  if (error) {
    if (some(error.errors, ['code', '403'])) {
      return <NotInDEERSAlert />;
    }
    return <LoadFail information="military" />;
  }

  if (serviceHistory.length === 0) {
    return <NoServiceHistoryAlert />;
  }

  return (
    <>
      <ProfileInfoTable
        data={serviceHistory}
        dataTransformer={transformServiceHistoryEntryIntoTableRow}
        title="Period of service"
        fieldName="serviceHistory"
        list
        level={2}
      />
      <div className="vads-u-margin-top--4">
        <va-additional-info
          disable-border
          trigger="What if my military service information doesn’t look right?"
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
            To reach the DMDC, call <va-telephone contact={CONTACTS.DS_LOGON} />
            , Monday through Friday (except federal holidays), 8:00 a.m. to 8:00
            p.m. ET. If you have hearing loss, call TTY:{' '}
            <va-telephone contact={CONTACTS.DS_LOGON_TTY} />.
          </p>
        </va-additional-info>
      </div>
    </>
  );
};

MilitaryInformationContent.propTypes = {
  militaryInformation: PropTypes.object,
  veteranStatus: PropTypes.object,
};

const MilitaryInformation = ({ militaryInformation, veteranStatus }) => {
  useEffect(() => {
    document.title = `Military Information | Veterans Affairs`;
  }, []);

  return (
    <>
      <Headline>Military information</Headline>
      <DowntimeNotification
        appTitle="Military Information"
        render={handleDowntimeForSection('military service')}
        dependencies={[externalServices.emis]}
      >
        <MilitaryInformationContent
          militaryInformation={militaryInformation}
          veteranStatus={veteranStatus}
        />
      </DowntimeNotification>
    </>
  );
};

MilitaryInformation.propTypes = {
  militaryInformation: PropTypes.shape({
    serviceHistory: PropTypes.shape({
      serviceHistory: PropTypes.arrayOf(
        PropTypes.shape({
          branchOfService: PropTypes.string,
          beginDate: PropTypes.string,
          endDate: PropTypes.string,
        }),
      ),
    }).isRequired,
  }).isRequired,
  veteranStatus: PropTypes.shape({
    isVeteran: PropTypes.bool,
    status: PropTypes.string,
    servedInMilitary: PropTypes.bool,
  }).isRequired,
};

const mapStateToProps = state => ({
  militaryInformation: state.vaProfile?.militaryInformation,
  veteranStatus: selectVeteranStatus(state),
});

export default connect(mapStateToProps)(MilitaryInformation);
