import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { toHash } from '../../../../../shared/utilities';
import { SCHEMA_LABELS } from '../../../../chapters/healthInsuranceInformation/planTypes';
import HealthInsuranceSummaryCard from '../../../../components/FormDescriptions/HealthInsuranceSummaryCard';

describe('HealthInsuranceSummaryCard', () => {
  const subject = ({ item, applicants = [] }) => {
    const mockStore = {
      getState: () => ({ form: { data: { applicants } } }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <HealthInsuranceSummaryCard {...item} />
      </Provider>,
    );
    return container.textContent;
  };

  it('should render insurance type', () => {
    const item = { insuranceType: 'hmo' };
    const textContent = subject({ item });
    expect(textContent).to.include('Type:');
    expect(textContent).to.include(SCHEMA_LABELS.hmo);
  });

  it('should render date range with start and end dates', () => {
    const item = {
      effectiveDate: '2023-01-15',
      expirationDate: '2024-01-15',
    };
    const textContent = subject({ item });
    expect(textContent).to.include('Dates:');
    expect(textContent).to.include('01/15/2023 - 01/15/2024');
  });

  it('should render date range with present when no end date', () => {
    const item = {
      effectiveDate: '2023-01-15',
      expirationDate: null,
    };
    const textContent = subject({ item });
    expect(textContent).to.include('01/15/2023 - present');
  });

  it('should render participant names', () => {
    const ssn = '321321321';
    const item = { healthcareParticipants: { [toHash(ssn)]: true } };
    const applicants = [
      { applicantSsn: ssn, applicantName: { first: 'John', last: 'Doe' } },
    ];
    const textContent = subject({ item, applicants });
    expect(textContent).to.include('Policy members:');
    expect(textContent).to.include('John Doe');
  });

  it('should render all sections', () => {
    const item = {
      insuranceType: 'medicare',
      effectiveDate: '2023-01-01',
      expirationDate: '2024-12-31',
      healthcareParticipants: {},
    };
    const textContent = subject({ item });
    expect(textContent).to.include('Type:');
    expect(textContent).to.include('Dates:');
    expect(textContent).to.include('Policy members:');
  });
});
