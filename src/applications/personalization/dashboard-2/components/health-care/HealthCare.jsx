import React from 'react';
import NotificationCTA from '../NotificationCTA';

import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
// import { recordDashboardClick } from 'applications/personalization/dashboard/helpers';

const HealthCareCard = props => {
  let cardTitle;
  let line1;
  let line2;
  let line3;
  const CTA = {};
  let sectionTitle;

  if (props.type === 'messages') {
    cardTitle = 'Latest Message';
    line1 = 'From: Dr. Susan Smith';
    line2 = 'Date: January 22nd, 2021';
    line3 = 'Subject: We received your most recent lab results ...';
    sectionTitle = 'Messages';
    CTA.icon = 'envelope';
    CTA.text = 'You have 2 unread messages';
    CTA.href = '';
    CTA.ariaLabel = 'View your unread messages';
  }

  if (props.type === 'appointments') {
    cardTitle = 'Next Appointment';
    line1 = 'Monday, November 12th, 2020';
    line2 = 'Time: 9:00 a.m. ET';
    line3 = 'VA Video Connect';
    sectionTitle = 'Appointments';
    CTA.icon = 'calendar';
    CTA.text = '6 upcoming appointments';
    CTA.href = '';
    CTA.ariaLabel = 'View upcoming appointments';
  }

  if (props.type === 'prescriptions') {
    sectionTitle = 'Prescriptions';
    cardTitle = 'Prescription refills';
    line1 = 'Metformin, 500 mg';
    line2 = 'Status: submitted on Monday, March 11th, 2021';
    line3 = '';
    CTA.icon = 'prescription-bottle';
    CTA.text = '3 prescription updates';
    CTA.href = '';
    CTA.ariaLabel = 'View prescription updates';
  }

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-l-col--12 medium-screen:vads-l-col--6 large-screen:vads-l-col--4 medium-screen:vads-u-padding-right--3">
      {/* Title */}
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--2p5">
        {sectionTitle}
      </h3>

      {/* Content */}
      <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2p5 vads-u-padding-x--2p5 vads-u-flex--fill">
        <h4 className="vads-u-margin-top--0 vads-u-font-size--h3">
          {cardTitle}
        </h4>
        <p>{line1}</p>
        <p>{line2}</p>
        <p className="vads-u-margin-bottom--0">{line3}</p>
      </div>

      {/* CTA */}
      <NotificationCTA CTA={CTA} />
    </div>
  );
};

const HealthCare = () => {
  return (
    <div className="health-care vads-u-margin-y--6">
      <h2 className="vads-u-margin-y--0">Health care</h2>

      <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
        {/* Messages */}
        <HealthCareCard type="messages" />
        {/* Appointments */}
        <HealthCareCard type="appointments" />
        {/* Prescriptions */}
        <HealthCareCard type="prescriptions" />
      </div>

      <div className="vads-u-margin-top--4">
        <h3>Manage your health care benefits</h3>
        <hr
          aria-hidden="true"
          className="vads-u-background-color--primary vads-u-margin-bottom--2 vads-u-margin-top--0p5 vads-u-border--0"
        />

        <p>
          <a
            href={mhvUrl(isAuthenticatedWithSSOe, 'download-my-data')}
            rel="noreferrer noopener"
            target="_blank"
            className="vads-u-margin-bottom--2"
            // onClick={recordEvent()}
          >
            Get your lab and test results
          </a>
        </p>

        <p>
          <a
            href="/health-care/get-medical-records/"
            // onClick={recordDashboardClick('health-records')}
          >
            Get your VA medical records
          </a>
        </p>
      </div>
    </div>
  );
};

export default HealthCare;
