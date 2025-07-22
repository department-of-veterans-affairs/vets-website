import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import EligibilitySummary from '../../components/EligibilitySummary';

const renderWithStore = initialState => {
  const reducer = (state = initialState) => state;
  const store = createStore(reducer);

  return render(
    <Provider store={store}>
      <EligibilitySummary />
    </Provider>,
  );
};

describe('<EligibilitySummary />', () => {
  it('should render with empty form data', () => {
    const initialState = {
      form: {
        data: {},
      },
    };
    const { container } = renderWithStore(initialState);

    expect(container).to.exist;
  });

  it('should render with empty form data', () => {
    const initialState = {
      form: {
        data: {},
      },
    };
    const { container, getByTestId } = renderWithStore(initialState);

    expect(container).to.exist;
    expect(getByTestId('title').innerHTML).to.contain(
      'High Technology Program eligibility summary',
    );
  });

  it('should render an ineligible summary when requirements are not met', () => {
    const initialState = {
      form: {
        data: {
          dutyRequirement: 'none',
          dateOfBirth: '1950-07-01',
          otherThanDishonorableDischarge: false,
        },
      },
    };
    const { container, getByTestId, queryByTestId } = renderWithStore(
      initialState,
    );

    expect(getByTestId('header').innerHTML).to.contain(
      'Based on your response, you may not be eligible.',
    );
    // All 3 requirements will show ineligible with a close icon
    expect(container.querySelectorAll('va-icon[icon="close"]').length).to.equal(
      3,
    );
    // Verify the text for each requirement
    expect(getByTestId('duty-requirement').innerHTML).to.contain(
      'These statements do not apply to me',
    );
    expect(getByTestId('dob-requirement').innerHTML).to.contain(
      "I'm over the age of 62",
    );
    expect(getByTestId('discharge-requirement').innerHTML).to.contain(
      'I did not receive a discharge under conditions other than dishonorable',
    );
    // Check for footer content including "error" message
    expect(getByTestId('failed-requirements-message')).to.exist;
    expect(getByTestId('back-button')).to.exist;
    expect(queryByTestId('continue-button')).not.to.exist;
  });

  it('should render an eligible summary when all requirements are met', () => {
    const initialState = {
      form: {
        data: {
          dutyRequirement: 'byDischarge',
          dateOfBirth: '1990-07-01',
          otherThanDishonorableDischarge: true,
        },
      },
    };
    const { container, getByTestId, queryByTestId } = renderWithStore(
      initialState,
    );

    expect(getByTestId('header').innerHTML).to.contain(
      'Based on your response, you are eligible.',
    );
    // All 3 requirements will show eligible with a check icon
    expect(container.querySelectorAll('va-icon[icon="check"]').length).to.equal(
      3,
    );
    // Verify the text for each requirement
    expect(getByTestId('duty-requirement').innerHTML).to.contain(
      "I'm a service member within 180 days of discharge who has or will",
    );
    expect(getByTestId('dob-requirement').innerHTML).to.contain(
      "I'm under the age of 62",
    );
    expect(getByTestId('discharge-requirement').innerHTML).to.contain(
      'I received a discharge under conditions other than dishonorable',
    );
    // Check for footer content including "error" message
    expect(queryByTestId('failed-requirements-message')).not.to.exist;
    expect(getByTestId('back-button')).to.exist;
    expect(getByTestId('continue-button')).to.exist;
  });
});
