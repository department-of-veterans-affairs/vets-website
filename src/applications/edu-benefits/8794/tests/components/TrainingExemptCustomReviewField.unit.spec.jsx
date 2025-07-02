import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import TrainingExemptCustomReviewField from '../../components/TrainingExemptCustomReviewField';

const renderWithStore = initialState => {
  const reducer = (state = initialState) => state;
  const store = createStore(reducer);
  return render(
    <Provider store={store}>
      <TrainingExemptCustomReviewField />
    </Provider>,
  );
};

describe('<TrainingExemptCustomReviewField />', () => {
  it('should render the exempt message when trainingExempt is true', () => {
    const initialState = {
      form: {
        data: {
          primaryOfficialTraining: {
            trainingExempt: true,
          },
        },
      },
    };

    const { container } = renderWithStore(initialState);
    const selector = container.querySelector('.review-row');

    expect(selector).to.not.be.null;
    expect(selector.innerHTML).to.contain('Exempt');
    expect(selector.innerHTML).to.contain(
      'Enter the date the required annual Section 305 training was completed.',
    );
  });

  it('should not render anything when trainingExempt is false', () => {
    const initialState = {
      form: {
        data: {
          primaryOfficialTraining: {
            trainingExempt: false,
          },
        },
      },
    };

    const { container } = renderWithStore(initialState);
    const selector = container.querySelector('.review-row');

    expect(selector).to.be.null;
  });

  it('should not render anything when trainingExempt is missing', () => {
    const initialState = {
      form: {
        data: {
          primaryOfficialTraining: {},
        },
      },
    };

    const { container } = renderWithStore(initialState);
    const selector = container.querySelector('.review-row');

    expect(selector).to.be.null;
  });
});
