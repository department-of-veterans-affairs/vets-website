import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { some } from 'lodash';
import { connect } from 'react-redux';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { renderDOB } from '../../util/personal-information/personalInformationUtils';
import { DevTools } from '~/applications/personalization/common/components/devtools/DevTools';

import { generatePdf } from '~/platform/pdf';
import { formatFullName } from '../../../common/helpers';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { focusElement } from '~/platform/utilities/ui';
import { selectVeteranStatus } from '~/platform/user/selectors';

import LoadFail from '../alerts/LoadFail';
import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import Headline from '../ProfileSectionHeadline';
import { transformServiceHistoryEntryIntoTableRow } from '../../helpers';
import { ProfileInfoCard } from '../ProfileInfoCard';

// Alert to show when a user does not appear to be a Veteran
const NotAVeteranAlert = () => {
  return (
    <>
      <va-alert status="info" data-testid="not-a-veteran-alert" uswds>
        <h2 slot="headline">We don’t have military service records for you</h2>

        <p>
          If you think this is an error, call us at{' '}
          <va-telephone contact={CONTACTS.HELP_DESK} /> (
          <va-telephone contact={CONTACTS['711']} tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </va-alert>
    </>
  );
};

// Alert to show if `GET service_history` returned a 403
const NotInDEERSAlert = () => {
  return (
    <>
      <va-alert status="warning" data-testid="not-in-deers-alert" uswds>
        <h2 slot="headline">
          We can’t match your information to any military service records
        </h2>
        <div>
          <p>We’re sorry for this issue.</p>
          <p>
            <b>
              If you want to learn what military service records may be on file
              for you
            </b>
            , call the Defense Manpower Data Center (DMDC) at{' '}
            <va-telephone contact={CONTACTS.DS_LOGON} />
            &nbsp;(
            <va-telephone contact={CONTACTS['711']} tty />
            ). The DMDC office is open Monday through Friday (except federal
            holidays), 8:00 a.m. to 8:00 p.m. ET.
          </p>
          <p>
            <b>
              If you think there might be a problem with your military service
              records
            </b>
            , you can apply for a correction.
          </p>
          <va-link
            href="https://www.archives.gov/veterans/military-service-records/correct-service-records.html"
            text="Learn how to correct your military service records on the National Archives website"
          />
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
      <va-alert status="warning" uswds>
        <h2 slot="headline">
          We can’t match your information to any military service records
        </h2>
        <div>
          <p>We’re sorry for this issue.</p>
          <p>
            <b>
              If you want to learn what military service records may be on file
              for you
            </b>
            , call the Defense Manpower Data Center (DMDC) at{' '}
            <va-telephone contact={CONTACTS.DS_LOGON} />
            &nbsp;(
            <va-telephone contact={CONTACTS['711']} tty />
            ). The DMDC office is open Monday through Friday (except federal
            holidays), 8:00 a.m. to 8:00 p.m. ET.
          </p>
          <p>
            <b>
              If you think there might be a problem with your military service
              records
            </b>
            , you can apply for a correction.
          </p>
          <va-link
            href="https://www.archives.gov/veterans/military-service-records/correct-service-records.html"
            text="Learn how to correct your military service records on the National Archives website"
          />
          .
        </div>
      </va-alert>
    </>
  );
};

const MilitaryInformationContent = ({
  dob,
  militaryInformation,
  totalDisabilityRating,
  userFullName = {
    first: '',
    middle: '',
    last: '',
    suffix: '',
  },
  veteranStatus,
}) => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  const { first, middle, last, suffix } = userFullName;

  const createPdf = () => {
    const pdfData = {
      title: `Veteran status card for ${formatFullName({
        first,
        middle,
        last,
        suffix,
      })}`,
      details: {
        fullName: formatFullName({ first, middle, last, suffix }),
        serviceHistory: militaryInformation.serviceHistory.serviceHistory,
        totalDisabilityRating,
        dob: renderDOB(dob),
        image: {
          title: 'V-A logo',
          url: 'https://www.va.gov/img/design/logo/logo-black-and-white.png',
        },
      },
    };
    generatePdf('veteranStatus', 'Veteran Status', pdfData);
  };

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
    return <LoadFail />;
  }

  if (serviceHistory.length === 0) {
    return <NoServiceHistoryAlert />;
  }

  return (
    <>
      <ProfileInfoCard
        data={serviceHistory.map(item =>
          transformServiceHistoryEntryIntoTableRow(item),
        )}
        title="Period of Service"
        level={2}
        asList
      />

      <div className="vads-u-margin-top--4">
        <va-button onClick={() => createPdf()} text="Download" />
      </div>

      <div className="vads-u-margin-top--4">
        <va-additional-info
          trigger="What if I don't think my military service information is correct?"
          uswds
        >
          <p className="vads-u-padding-bottom--2">
            Some Veterans have reported that their military service information
            in their VA.gov profiles doesn’t seem right. When this happens, it’s
            because there’s an error in the information we’re pulling into
            VA.gov from the Defense Enrollment Eligibility Reporting System
            (DEERS).
          </p>

          <p className="vads-u-padding-bottom--2">
            If you don’t think your military service information is correct
            here, call the Defense Manpower Data Center (DMDC). They’ll work
            with you to update your information in DEERS.
          </p>

          <p>
            You can call the DMDC at{' '}
            <va-telephone contact={CONTACTS.DS_LOGON} /> (
            <va-telephone contact={CONTACTS['711']} tty />
            ). They’re available Monday through Friday (except federal
            holidays), 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </va-additional-info>
      </div>
    </>
  );
};

MilitaryInformationContent.propTypes = {
  dob: PropTypes.string,
  militaryInformation: PropTypes.object,
  totalDisabilityRating: PropTypes.number,
  userFullName: PropTypes.object,
  veteranStatus: PropTypes.object,
};

const MilitaryInformation = ({
  dob,
  militaryInformation,
  totalDisabilityRating,
  userFullName,
  veteranStatus,
}) => {
  useEffect(() => {
    document.title = `Military Information | Veterans Affairs`;
  }, []);

  return (
    <div>
      <Headline>Military information</Headline>
      <DowntimeNotification
        appTitle="Military Information"
        render={handleDowntimeForSection('military service')}
        dependencies={[externalServices.emis]}
      >
        <MilitaryInformationContent
          militaryInformation={militaryInformation}
          veteranStatus={veteranStatus}
          dob={dob}
          totalDisabilityRating={totalDisabilityRating}
          userFullName={userFullName}
        />
      </DowntimeNotification>

      <va-featured-content uswds>
        <h3 className="vads-u-margin-top--0" slot="headline">
          Request your military records (DD214)
        </h3>
        <va-link
          href="/records/get-military-service-records"
          text="Learn how to request your DD214 and other military records"
        />
      </va-featured-content>

      <DevTools
        alwaysShowChildren={false}
        devToolsData={{ militaryInformation, veteranStatus }}
        panel
      >
        <p>Profile devtools test, please ignore.</p>
      </DevTools>
    </div>
  );
};

MilitaryInformation.propTypes = {
  dob: PropTypes.string,
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
  totalDisabilityRating: PropTypes.number,
  userFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }),
  veteranStatus: PropTypes.shape({
    isVeteran: PropTypes.bool,
    status: PropTypes.string,
    servedInMilitary: PropTypes.bool,
  }).isRequired,
};

const mapStateToProps = state => ({
  dob: state.vaProfile?.personalInformation?.birthDate,
  militaryInformation: state.vaProfile?.militaryInformation,
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  userFullName: state.vaProfile?.hero?.userFullName,
  veteranStatus: selectVeteranStatus(state),
});

export default connect(mapStateToProps)(MilitaryInformation);
