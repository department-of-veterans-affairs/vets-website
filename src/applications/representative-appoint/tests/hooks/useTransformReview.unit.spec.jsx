import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { useTransformForReview } from '../../hooks/useTransformForReview';

const mockFormStore = state => ({
  getState: () => state,
  subscribe: () => {},
  dispatch: () => ({}),
});

describe('useTransformForReview', () => {
  let props;
  let mockStore;
  let container;

  beforeEach(() => {
    props = {
      formData: {
        'view:selectedRepresentative': {
          attributes: { fullName: 'John Doe' },
          type: 'Attorney',
        },
        selectedAccreditedOrganizationName: 'Veterans Organization',
        'view:applicantIsVeteran': 'No',
        inputVeteranFullName: { first: 'Jane', middle: 'A', last: 'Doe' },
        inputVeteranSSN: '123-45-6789',
        inputVeteranVAFileNumber: '987654321',
        inputVeteranDOB: '1990-01-01',
        inputVeteranServiceNumber: 'S123456789',
        inputVeteranServiceBranch: 'Army',
        inputVeteranHomeAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'TX',
          postalCode: '12345',
        },
        inputVeteranPrimaryPhone: '555-1234',
        inputVeteranEmail: 'jane.doe@example.com',
        inputNonVeteranClaimantName: {
          first: 'John',
          middle: 'B',
          last: 'Doe',
        },
        inputNonVeteranClaimantDOB: '1990-01-01',
        inputNonVeteranClaimantRelationship: 'Spouse',
        inputNonVeteranClaimantHomeAddress: {
          street: '456 Oak St',
          city: 'Anytown',
          state: 'TX',
          postalCode: '54321',
        },
        inputNonVeteranClaimantPhone: '555-5678',
        inputNonVeteranClaimantEmail: 'john.doe@example.com',
      },
    };
    mockStore = mockFormStore({
      form: {
        submission: {
          timestamp: 'mockTimestamp',
        },
        data: {},
      },
    });

    const renderResult = render(
      <Provider store={mockStore}>
        <TestComponent {...props} />
      </Provider>,
    );
    container = renderResult.container;
  });

  const TestComponent = ({ formData }) => {
    const transformForReview = useTransformForReview(formData);
    return <div>{transformForReview}</div>;
  };

  it('should render the representative name', () => {
    const content = container.querySelector('div');
    expect(content.textContent).to.contain('John');
  });

  it('should render the organization name', () => {
    const content = container.querySelector('div');
    expect(content.textContent).to.contain('Veterans Organization');
  });

  context('when applicant is a veteran', () => {
    it('should render the veteran information', () => {
      props.formData['view:applicantIsVeteran'] = 'Yes';
      props.formData.inputNonVeteranClaimantName = {
        first: 'Jane',
        middle: 'A',
        last: 'Doe',
      };

      const renderResult = render(
        <Provider store={mockStore}>
          <TestComponent {...props} />
        </Provider>,
      );

      container = renderResult.container;

      const content = container.querySelector('div');
      expect(content.textContent).to.contain('Your informationFirst nameJane');
      expect(content.textContent).to.contain('123-45-6789');
    });
  });

  context('when applicant is not a veteran', () => {
    it('should render claimant information', () => {
      const content = container.querySelector('div');
      expect(content.textContent).to.contain('Your informationFirst nameJohn');
      expect(content.textContent).to.contain('Spouse');
    });
  });
});
