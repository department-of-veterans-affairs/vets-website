import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import BenefitsDisclaimerCustomReviewField from '../../components/BenefitsDisclaimerCustomReviewField';

const renderWithStore = initialState => {
  const reducer = (state = initialState) => state;
  const store = createStore(reducer);
  return render(
    <Provider store={store}>
      <BenefitsDisclaimerCustomReviewField />
    </Provider>,
  );
};

describe('<BenefitsDisclaimerCustomReviewField />', () => {
  it('should render the benefits disclaimer when view:benefitsDisclaimer is true', () => {
    const initialState = {
      form: {
        data: {
          primaryOfficialBenefitStatus: {
            'view:benefitsDisclaimer': true,
          },
        },
      },
    };

    const { container } = renderWithStore(initialState);
    const selector = container.querySelector('.review-row');

    expect(selector).to.not.be.null;
    expect(selector.innerHTML).to.contain('I understand');
    expect(selector.innerHTML).to.contain('Yes');
  });

  it('should not render anything when view:benefitsDisclaimer is false', () => {
    const initialState = {
      form: {
        data: {
          primaryOfficialBenefitStatus: {
            'view:benefitsDisclaimer': false,
          },
        },
      },
    };

    const { container } = renderWithStore(initialState);
    const selector = container.querySelector('.review-row');

    expect(selector).to.be.null;
  });

  it('should not render anything when view:benefitsDisclaimer is missing', () => {
    const initialState = {
      form: {
        data: {
          primaryOfficialBenefitStatus: {},
        },
      },
    };

    const { container } = renderWithStore(initialState);
    const selector = container.querySelector('.review-row');

    expect(selector).to.be.null;
  });
});
