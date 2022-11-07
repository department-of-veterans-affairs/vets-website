import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FormFooter from '../../components/FormFooter';
import formConfig from '../../config/form';

describe('10-10EZ', () => {
  describe('Form Footer', () => {
    it('should render help information on Form Footer', () => {
      const mockStore = {
        getState: () => ({
          hcaEnrollmentStatus: {
            isLoadingApplicationStatus: false,
            showHCAReapplyContent: false,
          },
          user: {
            login: {
              currentlyLoggedIn: false,
            },
            profile: {
              loading: false,
              loa: { current: 0 },
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const view = render(
        <Provider store={mockStore}>
          <FormFooter
            formConfig={formConfig}
            currentLocation={{ pathname: '/introduction' }}
          />
        </Provider>,
      );

      expect(view.container.textContent).to.contain('Need help?');
    });
  });
});
