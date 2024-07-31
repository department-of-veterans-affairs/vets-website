/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { hi } from 'date-fns/locale';
import { useHistory } from 'react-router-dom';
import FormLayout from '../new-appointment/components/FormLayout';
import ProviderAlert from './components/ProviderAlert';
// import mockData from '../services/mocks/wellHive/providerServices.json';

export default function ChooseCommunityCare() {
  const history = useHistory();

  const [providers, setProviders] = useState([
    {
      name: 'Dr. Kristina Jones',
      group: 'Tender Care Clinic',
      driveDistance: '7 minute drive (2 miles)',
      nextAvailable: 'June 6, 2024',
      reviewText: 'Review available appointments',
    },
  ]);

  const [providerDetails, setProviderDetails] = useState({
    providerName: 'Dr. Mike Torello',
    providerGroup: 'Trust care medical group',
    driveDistance: '12 minute drive (22 miles)',
    nextAvailable: 'June 6, 2024',
  });

  const goToFilterPage = () => {
    history.push('/filter-page');
  };

  useEffect(() => {
    let newProviders = [...providers];
    for (let i = 0; i < 4; i++) {
      newProviders = [...newProviders, { ...providers[0] }];
    }

    setProviders(newProviders);
  }, []);

  const [resultsCount, setResultsCount] = useState('12 results');

  const sortOptions = useState([
    { value: 'distance', label: 'Distance' },
    { value: 'rating', label: 'Rating' },
    { value: 'availability', label: 'Availability' },
    { value: 'name', label: 'Name' },
  ]);

  const showAlert = true;

  return (
    <FormLayout pageTitle="Choose a community care provider">
      <div>
        <h1>Choose a [community care] provider</h1>
        {showAlert ? (
          <ProviderAlert status="info" />
        ) : (
          <va-card background>
            <div>Your preferred provider</div>
            <div className="vads-u-font-weight--bold">
              {providerDetails.providerName}
            </div>
            <div>{providerDetails.providerGroup}</div>
            <div>{providerDetails.driveDistance}</div>
            <div>Next available: {providerDetails.nextAvailable}</div>
            <div>{providerDetails.reviewText}</div>
            <div className="vads-u-font-weight--bold vads-u-margin-top--2">
              <va-link
                aria-label="Review available appointments"
                text="Review available appointments"
                data-testid="review-available-appointments-link"
                role="link"
              />
            </div>
          </va-card>
        )}
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
        <div className="vads-l-grid-container vads-u-padding--0 vads-u-margin-top--2">
          <div className="vads-l-row">
            <div className="vads-l-col vads-u-font-weight--bold">
              <va-icon icon="filter_list" size={4} srtext="Filter icon" />{' '}
              <va-link
                aria-label="Filter"
                text="Filter"
                data-testid="filter-link"
                onClick={goToFilterPage}
                role="link"
              />
            </div>
            <div className="vads-l-col vads-u-text-align--right">
              {resultsCount}
            </div>
          </div>
        </div>
        <div className="vads-u-margin-top--2">
          {providers.map((provider, index) => (
            <div key={index}>
              <div className="vads-u-font-weight--bold">{provider.name}</div>
              <div>{provider.group}</div>
              <div>{provider.driveDistance}</div>
              <div>Next available: {provider.nextAvailable}</div>
              <div className="vads-u-font-weight--bold vads-u-margin-top--2">
                <va-link
                  aria-label={provider.reviewText}
                  text={provider.reviewText}
                  data-testid="review-available-appointments-link"
                  role="link"
                />
              </div>
              <hr />
            </div>
          ))}
        </div>
        <div>
          <va-link
            aria-label="More available appointments"
            text={`+${providers.length - 1} more available appointments`}
            data-testid="more-available-appointments-link"
            role="link"
          />
        </div>
      </div>
    </FormLayout>
  );
}
