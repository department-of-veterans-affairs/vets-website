import React, { useState, useEffect } from 'react';
import FormLayout from '../new-appointment/components/FormLayout';

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

export default function ConfirmApprovedPage() {
  const [confirmedData, setConfirmedData] = useState(0);

  // on react component mount, fetch data
  useEffect(() => {
    setConfirmedData(getData());
  }, []);

  return (
    <FormLayout>
      <div>
        <h1>Review your appointment details</h1>
        <h3>You're scheduling a {confirmedData.typeOfCare} appointment</h3>
        <p data-testid="subtitle">
          Confirm your appointment information is correct. If you need to update
          any information, select edit to make any changes.
        </p>
        <hr className="vads-u-margin-y--2" />
        <div className=" vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            <div className="vads-l-col vads-u-font-weight--bold">What</div>
            <div className="vads-l-col vads-u-text-align--right">
              <va-link
                aria-label="Edit what information"
                text="Edit"
                data-testid="edit-what-information-link"
                tabindex="0"
              />
            </div>
          </div>
        </div>
        <div>{confirmedData.typeOfCare}</div>
        <hr className="vads-u-margin-y--2" />
        <div className=" vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            <div className="vads-l-col vads-u-font-weight--bold">Provider</div>
            <div className="vads-l-col vads-u-text-align--right">
              <va-link
                aria-label="Edit provider information"
                text="Edit"
                data-testid="edit-provider-information-link"
                tabindex="0"
              />
            </div>
          </div>
        </div>
        <div>{confirmedData.provider}</div>
        <div>{confirmedData.clinic}</div>
        <div>{confirmedData.address}</div>
        <div>{confirmedData.city}</div>
        <div>Phone: {confirmedData.phone}</div>
        <hr className="vads-u-margin-y--2" />
        <div className=" vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            <div className="vads-l-col vads-u-font-weight--bold">When</div>
            <div className="vads-l-col vads-u-text-align--right">
              <va-link
                aria-label="Edit when information"
                text="Edit"
                data-testid="edit-when-information-link"
                tabindex="0"
              />
            </div>
          </div>
        </div>
        <div>{confirmedData.date}</div>
        <div>{confirmedData.time}</div>
        <hr className="vads-u-margin-y--2" />
        <div className=" vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            <div className="vads-l-col vads-u-font-weight--bold">
              Details you shared with your provider
            </div>
            <div className="vads-l-col vads-u-text-align--right">
              <va-link
                aria-label="Edit details share"
                text="Edit"
                data-testid="edit-details-shared-link"
                tabindex="0"
              />
            </div>
          </div>
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
      </div>
    </FormLayout>
  );
}
