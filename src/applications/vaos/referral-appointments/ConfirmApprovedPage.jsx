import React, { useState, useEffect } from 'react';
import PageLayout from '../appointment-list/components/PageLayout';

const staticData = {
  typeOfCare: 'Primary Care',
  provider: 'Kristina Jones, NP',
  clinic: 'Tender Care Clinic',
  address: '1234 Cool st.',
  city: 'Aewsometown, AZ',
  phone: '555-123-4567',
  date: 'Thursday, June 20, 2024',
  time: '4:15 p.m. PST',
  details: 'Back pain',
};

const dynamicData = {
  // Fill in real data here, network call, etc.
};

const getData = (typeOfData = 'static') => {
  return typeOfData === 'static' ? staticData : dynamicData;
};

export default function ConfirmApproved() {
  const [confirmedData, setConfirmedData] = useState(0);

  // on react component mount, fetch data
  useEffect(() => {
    setConfirmedData(getData());
  }, []);

  return (
    <PageLayout showBreadcrumbs showNeedHelp>
      <div className="title-text-eyebrow">New Appointment</div>
      <h1>Review your appointment details</h1>
      <h3>You're scheduling a {confirmedData.typeOfCare} appointment</h3>
      <p data-testid="subtitle">
        Confirm your appointment information is correct. If you need to update
        any information, select edit to make any changes.
      </p>
      <hr className="vads-u-margin-y--2" />
      <div className="vads-u-font-weight--bold">What</div>
      <div>{confirmedData.typeOfCare}</div>
      <hr className="vads-u-margin-y--2" />
      <div className="vads-u-font-weight--bold">Provider [Edit link]</div>
      <div>{confirmedData.provider}</div>
      <div>{confirmedData.clinic}</div>
      <div>{confirmedData.address}</div>
      <div>{confirmedData.city}</div>
      <div>Phone: {confirmedData.phone}</div>
      <hr className="vads-u-margin-y--2" />
      <div className="vads-u-font-weight--bold">When</div>
      <div>{confirmedData.date}</div>
      <div>{confirmedData.time}</div>
      <hr className="vads-u-margin-y--2" />
      <div className="vads-u-font-weight--bold">
        Details you shared with your provider
      </div>
      <div>{confirmedData.details}</div>
      <hr className="vads-u-margin-y--2" />
      <div className="vads-u-margin-top--4">
        <va-button label="Back" text="Back" secondary uswds />
        <va-button
          class="vads-u-margin-left--2"
          label="Continue"
          text="Continue"
          uswds
        />
      </div>
    </PageLayout>
  );
}
