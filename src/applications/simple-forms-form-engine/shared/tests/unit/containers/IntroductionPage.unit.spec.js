import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import IntroductionPage from '../../../containers/IntroductionPage';

const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        userFullName: {
          first: 'John',
          middle: 'A',
          last: 'Doe',
        },
      },
    },
    form: {
      loadedData: {
        metadata: {},
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const renderWithProvider = (Component, store = mockStore) => {
  return render(<Provider store={store}>{Component}</Provider>);
};

describe('<IntroductionPage /> component', () => {
  describe('hides links for proceeding without logging in', () => {
    it('does not render the link anywhere on the page', () => {
      const screen = renderWithProvider(
        <IntroductionPage
          route={{
            formConfig: {},
            pageList: [],
          }}
        />,
      );

      const unauthedLink = screen.queryByText(
        'Start your application without signing in',
      );
      expect(unauthedLink).to.not.exist;
    });
  });

  describe('ombInfo', () => {
    context('when ombInfo is present', () => {
      it('renders OMB info from props', () => {
        const ombInfo = {
          expDate: '8/29/2025',
          ombNumber: '1212-1212',
          resBurden: 30,
        };

        const screen = renderWithProvider(
          <IntroductionPage
            ombInfo={ombInfo}
            route={{
              formConfig: {},
              pageList: [],
            }}
          />,
        );

        const vaOmbInfo = screen.getByTestId('va-omb-info');

        expect(vaOmbInfo).to.have.attribute(
          'res-burden',
          ombInfo.resBurden.toString(),
        );
        expect(vaOmbInfo).to.have.attribute('omb-number', ombInfo.ombNumber);
        expect(vaOmbInfo).to.have.attribute('exp-date', ombInfo.expDate);
      });
    });

    context('when ombInfo is missing', () => {
      it('omits the va-omb-info component', () => {
        const screen = renderWithProvider(
          <IntroductionPage
            route={{
              formConfig: {},
              pageList: [],
            }}
          />,
        );

        expect(screen.queryByTestId('va-omb-info')).to.be.null;
      });
    });
  });
});
