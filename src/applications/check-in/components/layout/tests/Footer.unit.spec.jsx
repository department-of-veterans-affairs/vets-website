import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../utils/i18n/i18n';
import Footer from '../Footer';

describe('check-in', () => {
  describe('Footer', () => {
    const initState = {
      checkInData: {
        app: 'dayOf',
        form: {
          pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
        },
      },
    };
    const middleware = [];
    const mockStore = configureStore(middleware);
    const mockRouter = {
      params: {
        token: 'token-123',
      },
      location: {
        pathname: '/third-page',
      },
    };
    it('Renders day-of check-in footer', () => {
      const component = render(
        <Provider store={mockStore(initState)}>
          <I18nextProvider i18n={i18n}>
            <Footer router={mockRouter} isPreCheckIn={false} />
          </I18nextProvider>
        </Provider>,
      );
      const heading = component.getByTestId('heading');
      expect(heading).to.exist;
      expect(heading).to.contain.text('Need Help?');
      expect(component.getByTestId('day-of-check-in-message')).to.exist;
      expect(component.queryByTestId('pre-check-in-message')).to.not.exist;
      expect(component.queryByTestId('day-of-travel-extra-message')).to.not
        .exist;
    });
    it('Renders extra messages on the day of footer', () => {
      const checkInStateComplete = JSON.parse(JSON.stringify(initState));
      checkInStateComplete.checkInData.form.pages.currentPage = 'complete';
      const completeMockRouter = {
        params: {
          token: 'token-123',
        },
        location: {
          pathname: '/complete',
        },
      };
      const component = render(
        <Provider store={mockStore(initState)}>
          <I18nextProvider i18n={i18n}>
            <Footer router={completeMockRouter} isPreCheckIn={false} />
          </I18nextProvider>
        </Provider>,
      );
      expect(component.getByTestId('day-of-travel-extra-message')).to.exist;
    });
    it('Renders default pre-check-in footer', () => {
      const component = render(
        <Provider store={mockStore(initState)}>
          <I18nextProvider i18n={i18n}>
            <Footer router={mockRouter} isPreCheckIn />
          </I18nextProvider>
        </Provider>,
      );
      const heading = component.getByTestId('heading');
      expect(heading).to.exist;
      expect(heading).to.contain.text('Need Help?');
      expect(component.queryByTestId('day-of-check-in-message')).to.not.exist;
      expect(component.queryByTestId('intro-extra-message')).to.not.exist;
      expect(component.getByTestId('pre-check-in-message')).to.exist;
    });
    it('Render extra message on the intro page for pre-check-in', () => {
      const preCheckInStateIntro = JSON.parse(JSON.stringify(initState));
      preCheckInStateIntro.checkInData.form.pages.currentPage = 'introduction';
      const introMockRouter = {
        params: {
          token: 'token-123',
        },
        location: {
          pathname: '/introduction',
        },
      };
      const component = render(
        <Provider store={mockStore(preCheckInStateIntro)}>
          <I18nextProvider i18n={i18n}>
            <Footer router={introMockRouter} isPreCheckIn />
          </I18nextProvider>
        </Provider>,
      );
      expect(component.getByTestId('intro-extra-message')).to.exist;
    });
  });
});
