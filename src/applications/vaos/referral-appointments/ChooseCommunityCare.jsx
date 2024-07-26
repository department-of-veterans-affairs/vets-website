/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormLayout from '../new-appointment/components/FormLayout';
import ProviderAlert from './components/ProviderAlert';
import { getProviderServices } from '../services/referral';
import {
  processProviderServices,
  fetchAndProcessProviderSlots,
  sortOptions,
} from '../utils/referralUtility';
import ProviderList from './components/ProviderList';
import FilterHeaderRow from './components/FilterHeaderRow';
import PreferredProviderDetails from './components/PreferredProviderDetails';

export default function ChooseCommunityCare() {
  const history = useHistory();

  const [providers, setProviders] = useState([]);
  const [providerDetails, setProviderDetails] = useState({
    providerName: 'Dr. John Doe',
    providerGroup: 'HealthCare Group',
    driveDistance: '15 miles',
    nextAvailable: 'Oct 15, 2023',
    reviewText: 'Review available appointments',
  });
  const [resultsCount, setResultsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const showAlert = false;

  const fetchData = async () => {
    try {
      let providerServices = await getProviderServices();
      if (providerServices.data.providerServices.length > 0) {
        providerServices = processProviderServices(providerServices);
      }
      providerServices = await Promise.all(
        providerServices.map(fetchAndProcessProviderSlots),
      );

      setProviders(providerServices);
      setResultsCount(providerServices.length);
    } catch (networkError) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const goToFilterPage = () => {
    history.push('/filter-page');
  };

  if (loading) {
    return (
      <FormLayout pageTitle="Review Approved Referral">
        <va-loading-indicator set-focus message="Loading your data..." />
      </FormLayout>
    );
  }

  if (error) {
    return (
      <VaAlert status="error" visible>
        <h2 slot="headline">There was an error trying to get providers</h2>
        <p>Please try again later, or contact your VA facility for help.</p>
      </VaAlert>
    );
  }

  return (
    <FormLayout pageTitle="Choose a community care provider">
      <div>
        <h1>Choose a [community care] provider</h1>
        {showAlert ? (
          <ProviderAlert status="info" />
        ) : (
          <PreferredProviderDetails providerDetails={providerDetails} />
        )}
        <h3>All providers</h3>
        <va-select
          hint={null}
          label="Sort provider by:"
          message-aria-describedby="Sort provider by"
          name="options"
          value=""
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </va-select>
        <FilterHeaderRow
          resultsCount={resultsCount}
          goToFilterPage={goToFilterPage}
        />
        <ProviderList providers={providers} />
        <div>
          <va-link
            aria-label="More available appointments"
            text={`+${resultsCount - 1} more available appointments`}
            data-testid="more-available-appointments-link"
            tabindex="0"
          />
        </div>
      </div>
    </FormLayout>
  );
}
