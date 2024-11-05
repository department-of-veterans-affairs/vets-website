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

  it('should render the UnderReviewConfirmationFry component when chosenBenefit is "fry"', () => {
    const { mockStore } = getData({ chosenBenefit: 'fry' });
    const { getByText } = renderComponent({ mockStore });

    // Check for specific text indicating the Fry Scholarship component is rendered
    expect(
      getByText(
        'We’ll review your eligibility for the Fry Scholarship (Chapter 33).',
      ),
    ).to.exist;
  });

  it('should render the UnderReviewConfirmationDEAChapter35 component when chosenBenefit is "dea"', () => {
    const { mockStore } = getData({ chosenBenefit: 'dea' });
    const { getByText } = renderComponent({ mockStore });

    // Check for specific text indicating DEA Chapter 35 component is rendered
    expect(
      getByText(
        "We’ll review your eligibility for the Survivors' and Dependents' Educational Assistance (Chapter 35).",
      ),
    ).to.exist;
  });

  it('should render nothing if chosenBenefit is neither "fry" nor "dea"', () => {
    const { mockStore } = getData({ chosenBenefit: 'unknown' });
    const { container } = renderComponent({ mockStore });

    // Expect the container to be empty, as no component should render for "unknown"
    expect(container.innerHTML).to.equal('');
  });
});
