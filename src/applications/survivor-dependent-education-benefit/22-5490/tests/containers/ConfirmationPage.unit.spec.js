import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ConfirmationPage from '../../containers/ConfirmationPage';

describe('<ConfirmationPage>', () => {
  // Utility function to create mock store and mock data
  const getData = ({ formId = '5490', fullName = {}, chosenBenefit } = {}) => ({
    mockStore: {
      getState: () => ({
        form: {
          formId,
          data: {
            fullName: {
              first: fullName.first || 'Jane',
              middle: fullName.middle || 'A',
              last: fullName.last || 'Doe',
              suffix: fullName.suffix || '',
            },
            chosenBenefit,
          },
          submission: {},
        },
        confirmationError: null,
        confirmationLoading: false,
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  // Render the component wrapped in the Redux provider
  const renderComponent = ({ mockStore }) =>
    render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );

  it('should render the UnderReviewConfirmationFry component with the new title when chosenBenefit is "fry"', () => {
    const { mockStore } = getData({ chosenBenefit: 'fry' });
    const { getByText } = renderComponent({ mockStore });

    // Check for specific text indicating the Fry Scholarship component is rendered
    expect(
      getByText(
        'We’ll review your eligibility for the Fry Scholarship (Chapter 33).',
      ),
    ).to.exist;

    // Check for the presence of the new "FRY, Chapter 33" title
    expect(getByText('FRY, Chapter 33')).to.exist;

    // Check for the received application title text
    expect(getByText('We’ve received your application')).to.exist;

    // Check for the application form title
    expect(getByText('Application for VA Education Benefits (VA Form 22-5490)'))
      .to.exist;
  });

  it('should render the UnderReviewConfirmationDEAChapter35 component with the new title when chosenBenefit is "dea"', () => {
    const { mockStore } = getData({ chosenBenefit: 'dea' });
    const { getByText } = renderComponent({ mockStore });

    // Check for specific text indicating DEA Chapter 35 component is rendered
    expect(
      getByText(
        "We’ll review your eligibility for the Survivors' and Dependents' Educational Assistance (Chapter 35).",
      ),
    ).to.exist;

    // Check for the presence of the new "DEA, Chapter 35" title
    expect(getByText('DEA, Chapter 35')).to.exist;

    // Check for the received application title text
    expect(getByText('We’ve received your application')).to.exist;

    // Check for the application form title
    expect(getByText('Application for VA Education Benefits (VA Form 22-5490)'))
      .to.exist;
  });

  it('should render nothing if chosenBenefit is neither "fry" nor "dea"', () => {
    const { mockStore } = getData({ chosenBenefit: 'unknown' });
    const { container } = renderComponent({ mockStore });

    // Expect the container to be empty, as no component should render for "unknown"
    expect(container.innerHTML).to.equal('');
  });
});
