import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { some } from 'lodash';
import { connect } from 'react-redux';
import {
  VaAlert,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import recordEvent from 'platform/monitoring/record-event';
import ProofOfVeteranStatusCardExample from '../proof-of-veteran-status/proof-of-veteran-status-card-example';

import { DevTools } from '~/applications/personalization/common/components/devtools/DevTools';

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
      <va-alert status="info" data-testid="not-a-veteran-alert">
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
      <va-alert status="warning" data-testid="not-in-deers-alert">
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
          <a href="https://www.archives.gov/veterans/military-service-records/correct-service-records.html">
            Learn how to correct your military service records on the National
            Archives website
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
          <a href="https://www.archives.gov/veterans/military-service-records/correct-service-records.html">
            Learn how to correct your military service records on the National
            Archives website
          </a>
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
      <ProfileInfoCard
        data={serviceHistory.map(item =>
          transformServiceHistoryEntryIntoTableRow(item),
        )}
        title="Period of Service"
        level={2}
        asList
      />

      <div className="vads-u-margin-top--4">
        <va-additional-info trigger="What if I don't think my military service information is correct?">
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
  militaryInformation: PropTypes.object,
  veteranStatus: PropTypes.object,
};

const MilitaryInformation = ({ militaryInformation, veteranStatus }) => {
  useEffect(() => {
    document.title = `Military Information | Veterans Affairs`;
  }, []);

  const analyticsEvent = {
    'alert-box-type': 'info',
    'alert-box-heading': 'If you have a presumptive condition',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': true,
    'reason-for-alert': 'presumptive condition details',
  };

  const [visibleAlert, setVisibleAlert] = useState(true);
  // let isModalVisible = false;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const onModalCloseEvent = () => setIsModalVisible(false);
  const openModal = () => setIsModalVisible(true);

  const hideAlert = () => {
    setVisibleAlert(false);
    recordEvent({ ...analyticsEvent, event: 'int-alert-box-close' });
  };
  if (visibleAlert) {
    recordEvent({ ...analyticsEvent, event: 'visible-alert-box' });
  }

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
        />
      </DowntimeNotification>
      <div id="proof-of-veteran-status">
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--4 vads-u-margin-bottom--1p5">
          Proof of Veteran status
        </h2>
        <p>
          You can download your military information to prove you served in the
          United Status Uniformed Services. This status doesn’t entitle you to
          any VA benefits. It can also help provide validation when trying to
          access military discounts provided by retailers, restaurants and other
          services. There are no forms to fill out. Your veteran status is
          automatically generated by our system. If you feel your information is
          incorrect, please visit your{' '}
          <a href="#proof-of-veteran-status">profile page.</a>
        </p>
        <div className="vads-u-margin--1 vads-u-margin-y--2">
          <ProofOfVeteranStatusCardExample />
        </div>
        <div style={{ fontSize: '18px' }}>
          <i className="fa fa-download" aria-hidden="true" />{' '}
          <i className="fa fa-app-store" />{' '}
          <a href="#proof-of-veteran-status" onClick={openModal}>
            Download and print your Veteran status card
          </a>
        </div>
        <p>
          When you download our VA mobile app, your Veteran status will be
          available once you are logged in.
        </p>
        <div id="mobile-download-prompt">
          <VaAlert
            close-btn-aria-label="Close notification"
            status="info"
            closeable
            onCloseEvent={hideAlert}
            visible={visibleAlert}
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              Access your Veteran status on your mobile device.
            </h2>
            <div>
              <p className="vads-u-margin-y--0">
                You can use our new mobile app to view and show your status with
                retailers and other service providers. Download the VA: Health
                and Benefits mobile app to get started.
              </p>
              <div className="vads-u-font-size--lg">
                <p>
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href="https://apps.apple.com/us/app/va-health-and-benefits/id1559609596"
                  >
                    <i
                      className="fab fa-app-store-ios fa-lg vads-u-margin--1"
                      aria-hidden="true"
                    />
                    <span className="vads-u-font-size--md">
                      Download the app from the App Store
                    </span>
                  </a>
                </p>
                <p>
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href="https://play.google.com/store/apps/details?id=gov.va.mobileapp&hl=en_US&gl=US&pli=1"
                  >
                    <i
                      className="fab fa-google-play fa-lg vads-u-margin--1"
                      aria-hidden="true"
                    />
                    <span className="vads-u-font-size--md">
                      Download the app from Google Play
                    </span>
                  </a>
                </p>
              </div>
            </div>
          </VaAlert>
        </div>
        <div>
          <VaModal
            modalTitle="Download this PDF and open it in Acrobat Reader"
            onCloseEvent={onModalCloseEvent}
            onPrimaryButtonClick={() => {
              // TODO download PDF
              // eslint-disable-next-line no-console
              console.log('TODO: download PDF');
            }}
            primaryButtonText="Download Veteran status card"
            visible={isModalVisible}
            clickToClose
          >
            <p>
              Download this PDF to your desktop computer or laptop. Then use
              Adobe Acrobat Reader to open and fill out the form. Don’t try to
              open the PDF on a mobile device or fill it out in your browser.
            </p>
            <p>
              If you just want to fill out a paper copy, open the PDF in your
              browser and print it from there.
            </p>
            <p>
              <a
                href="https://get.adobe.com/reader/"
                target="_blank"
                rel="noreferrer noopener"
              >
                Get Acrobat Reader for free from Adobe
              </a>
            </p>
          </VaModal>
        </div>
      </div>
      <va-featured-content>
        <div className="vads-u-margin-y--0">
          <h3 className="vads-u-margin-top--0" slot="headline">
            Request your military records (DD214)
          </h3>
          <a href="/records/get-military-service-records">
            Learn how to request your DD214 and other military records
          </a>
        </div>
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
