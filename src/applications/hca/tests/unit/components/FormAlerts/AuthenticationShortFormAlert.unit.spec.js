import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import AuthenticatedShortFormAlert from '../../../../components/FormAlerts/AuthenticatedShortFormAlert';
import { HIGH_DISABILITY_MINIMUM } from '../../../../utils/constants';

describe('hca <AuthenticatedShortFormAlert>', () => {
  const mockStore = {
    getState: () => ({
      form: {
        data: {
          'view:totalDisabilityRating': HIGH_DISABILITY_MINIMUM,
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  context('when the component renders', () => {
    it('should render `va-alert` with correct title', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <AuthenticatedShortFormAlert />
        </Provider>,
      );
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.contain.text(
        'You can fill out a shorter application',
      );
    });

    it('should render the correct disability rating', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <AuthenticatedShortFormAlert />
        </Provider>,
      );
      const selector = container.querySelector('va-alert');
      expect(selector).to.contain.text(
        `Our records show that you have a VA service-connected disability rating of ${HIGH_DISABILITY_MINIMUM}%.`,
      );
    });

    it('should render instructions for what to do if the Veteran feels their rating is incorrect', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <AuthenticatedShortFormAlert />
        </Provider>,
      );
      const selector = container.querySelector('va-additional-info');
      expect(selector).to.exist;
      expect(selector).to.have.attr(
        'trigger',
        'What if I don’t think my rating information is correct here?',
      );
    });
  });
});
