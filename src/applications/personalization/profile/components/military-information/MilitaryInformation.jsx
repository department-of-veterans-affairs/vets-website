import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { some } from 'lodash';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { connect } from 'react-redux';

import { DevTools } from '~/applications/personalization/common/components/devtools/DevTools';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { focusElement } from '~/platform/utilities/ui';
import { selectVeteranStatus } from '~/platform/user/selectors';

import {
  TOGGLE_NAMES,
  Toggler,
  useFeatureToggle,
} from 'platform/utilities/feature-toggles';
import LoadFail from '../alerts/LoadFail';
import Headline from '../ProfileSectionHeadline';
import { transformServiceHistoryEntryIntoTableRow } from '../../helpers';
import { ProfileInfoSection } from '../ProfileInfoSection';

// Alert to show when a user does not appear to be a Veteran
const NotAVeteranAlert = () => {
  return (
    <>
      <va-alert
        status="info"
        data-testid="not-a-veteran-alert"
        uswds
        class="vads-u-margin-bottom--4"
      >
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
      <va-alert
        status="warning"
        data-testid="not-in-deers-alert"
        uswds
        class="vads-u-margin-bottom--4"
      >
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
      <va-alert status="warning" uswds class="vads-u-margin-bottom--4">
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
    return <LoadFail />;
  }

  if (serviceHistory.length === 0) {
    return <NoServiceHistoryAlert />;
  }

  return (
    <>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profile2Enabled}>
        <Toggler.Enabled>
          <div className="vads-u-margin-bottom--4 vads-u-margin-top--1">
            <MilitaryRecordErrorInfo />
          </div>
        </Toggler.Enabled>
      </Toggler>
      <ProfileInfoSection
        data={serviceHistory.map(item =>
          transformServiceHistoryEntryIntoTableRow(item),
        )}
        title="Period of Service"
        level={2}
        asList
      />

      <Toggler toggleName={Toggler.TOGGLE_NAMES.profile2Enabled}>
        <Toggler.Disabled>
          <div className="vads-u-margin-bottom--4 vads-u-margin-top--1">
            <MilitaryRecordErrorInfo />
          </div>
        </Toggler.Disabled>
      </Toggler>
    </>
  );
};

MilitaryInformationContent.propTypes = {
  militaryInformation: PropTypes.object,
  veteranStatus: PropTypes.object,
};

const MilitaryRecordErrorInfo = () => (
  <va-additional-info
    trigger="What if I don't think my military service information is correct?"
    uswds
  >
    <p className="vads-u-padding-bottom--2">
      If you don’t think your military service information is correct here, call
      the Defense Manpower Data Center (DMDC). They’ll work with you to update
      your information in DEERS.
    </p>

    <p>
      You can call the DMDC at <va-telephone contact={CONTACTS.DS_LOGON} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). They’re available Monday through Friday (except federal holidays), 8:00
      a.m. to 8:00 p.m. ET.
    </p>
  </va-additional-info>
);

const MilitaryInformation = ({ militaryInformation, veteranStatus }) => {
  useEffect(() => {
    document.title = `Military Information | Veterans Affairs`;
  }, []);

  const { useToggleValue } = useFeatureToggle();
  const isProfile2Enabled = useToggleValue(TOGGLE_NAMES.profile2Enabled);
  const headlineText = isProfile2Enabled
    ? 'Service history information'
    : 'Military Information';

  return (
    <div>
      <Headline>{headlineText}</Headline>
      <DowntimeNotification
        appTitle="military information page"
        dependencies={[externalServices.VAPRO_MILITARY_INFO]}
      >
        <MilitaryInformationContent
          militaryInformation={militaryInformation}
          veteranStatus={veteranStatus}
        />
      </DowntimeNotification>

      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
        Request your military service records
      </h2>

      <p className="vads-u-margin-y--1">
        You can request a copy of your DD214 and other military service records
        from the National Archives.
      </p>

      <va-link
        href="/records/get-military-service-records"
        text="Learn how to request your DD214 and other military records"
        active
      />

      <DevTools devToolsData={{ militaryInformation, veteranStatus }} panel>
        <p>Profile devtools test, please ignore.</p>
      </DevTools>
    </div>
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
