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
        veteranFullName: { first: 'Jane', middle: 'A', last: 'Doe' },
        veteranSocialSecurityNumber: '123-45-6789',
        veteranVAFileNumber: '987654321',
        veteranDateOfBirth: '1990-01-01',
        serviceNumber: 'S123456789',
        serviceBranch: 'Army',
        veteranHomeAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'TX',
          postalCode: '12345',
        },
        primaryPhone: '555-1234',
        veteranEmail: 'jane.doe@example.com',
        applicantName: { first: 'John', middle: 'B', last: 'Doe' },
        applicantDOB: '1990-01-01',
        claimantRelationship: 'Spouse',
        homeAddress: {
          street: '456 Oak St',
          city: 'Anytown',
          state: 'TX',
          postalCode: '54321',
        },
        applicantPhone: '555-5678',
        applicantEmail: 'john.doe@example.com',
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
      props.formData.applicantName = {
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
