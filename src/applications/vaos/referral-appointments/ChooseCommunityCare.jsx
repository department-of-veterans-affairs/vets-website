/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import FormLayout from '../new-appointment/components/FormLayout';

export default function ChooseCommunityCare() {
  const [providerName, setProviderName] = useState('Dr. Kristina Jones');
  const [providerGroup, setProviderGroup] = useState('Tender Care Clinic');
  const [driveDistance, setDriveDistance] = useState(
    '7 minute drive (2 miles)',
  );
  const [nextAvailable, setNextAvailable] = useState('June 6, 2024');
  const [reviewText, setReviewText] = useState('Review available appointments');
  const [resultsCount, setResultsCount] = useState('12 results');

  const sortOptions = useState([
    { value: 'distance', label: 'Distance' },
    { value: 'rating', label: 'Rating' },
    { value: 'availability', label: 'Availability' },
    { value: 'name', label: 'Name' },
  ]);

  return (
    <FormLayout>
      <h1>Choose a [community care] provider</h1>
      <h3>All providers</h3>
      <va-select
        hint={null}
        label="Sort provider by:"
        message-aria-describedby="Sort provider by"
        name="options"
        value=""
      >
        {sortOptions[0].map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </va-select>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row">
          <div className="vads-l-col vads-u-font-weight--bold">
            <va-icon icon="filter_list" size={4} srtext="Filter icon" /> Filter
          </div>
          <div className="vads-l-col vads-u-text-align--right">
            {resultsCount}
          </div>
        </div>
      </div>
      <div>
        <div className="vads-u-font-weight--bold">{providerName}</div>
        <div>{providerGroup}</div>
        <div>{driveDistance}</div>
        <div>Next available: {nextAvailable}</div>
        <div className="vads-u-font-weight--bold vads-u-margin-top--2">
          <va-link
            aria-label={reviewText}
            text={reviewText}
            data-testid="review-available-appointments-link"
          />
        </div>
      </div>
      <hr />
    </FormLayout>
  );
}
