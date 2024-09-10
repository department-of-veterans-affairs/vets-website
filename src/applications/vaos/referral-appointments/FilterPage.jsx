/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormLayout from '../new-appointment/components/FormLayout';
import mockData from '../services/mocks/epsApi/providerServices.json';
import { setSelectedProvider, setSortProviderBy } from './redux/actions';
import { selectProvider, selectProviderSortBy } from './redux/selectors';

const extractProviderInfo = data => {
  return data.providerServices.map(service => {
    return {
      id: service.id,
      location: service.location.address,
      provider: service.providerOrganization.name,
    };
  });
};

const providerOptions = extractProviderInfo(mockData);

export default function ReviewApproved() {
  const history = useHistory();
  const dispatch = useDispatch();
  const storedFilterProvider = useSelector(selectProvider);
  const storedSortProviderBy = useSelector(selectProviderSortBy);

  const [selectedPracticeState, setSelectedPracticeState] = useState(
    storedFilterProvider,
  );
  const [sortProviderByState, setSortProviderByState] = useState(
    storedSortProviderBy,
  );

  useEffect(
    () => {
      setSelectedPracticeState(storedFilterProvider);
      setSortProviderByState(storedSortProviderBy);
    },
    [storedFilterProvider, storedSortProviderBy],
  );

  const applyFilter = () => {
    dispatch(setSelectedProvider(selectedPracticeState));
    dispatch(setSortProviderBy(sortProviderByState));
    history.push('/choose-community-care-appointment');
  };

  const sortOptions = [
    { value: 'distance', label: 'Distance' },
    { value: 'lastName', label: 'Last Name' },
  ];

  return (
    <FormLayout pageTitle="CC Filter Page" isReviewPage>
      <div>
        <h1>Filter [physical therapy] providers</h1>
        <hr />
        <div>
          <VaSelect
            name="sort-options"
            data-test-id="sort-options"
            label="Sort providers by:"
            value={storedSortProviderBy || undefined}
            required
            onVaSelect={e => setSortProviderByState(e.detail.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </VaSelect>
        </div>
        <div>
          {providerOptions.length > 0 && (
            <VaSelect
              name="practice-type"
              data-test-id="practice-type"
              label="Practice:"
              required
              value={storedFilterProvider || undefined}
              onVaSelect={e => setSelectedPracticeState(e.detail.value)}
            >
              {providerOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {`${option.provider} - ${option.location}`}
                </option>
              ))}
            </VaSelect>
          )}
        </div>
        <div className="vads-u-margin-top--2">
          <va-button
            className="va-button-link"
            secondary
            text="Cancel"
            onClick={() => history.push('/choose-community-care-appointment')}
            data-testid="cancel-button"
            uswds
          />
          <va-button
            className="va-button-link"
            text="Apply"
            onClick={applyFilter}
            data-testid="apply-button"
            uswds
          />
        </div>
      </div>
    </FormLayout>
  );
}
