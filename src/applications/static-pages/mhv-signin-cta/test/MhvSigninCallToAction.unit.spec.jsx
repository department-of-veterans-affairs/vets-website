import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { MhvSigninCallToAction, mapStateToProps } from '../index';

describe('MHV Signin CTA', () => {
  describe('map state properties', () => {
    it('user not logged in', () => {
      const state = {
        user: {
          login: {
            currentlyLoggedIn: false,
          },
          profile: {
            loa: {
              current: null,
            },
          },
        },
      };
      const result = mapStateToProps(state);
      expect(result.userIsLoggedIn).to.eql(false);
    });

    it('user logged in', () => {
      const state = {
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            loa: {
              current: 3,
            },
            signIn: {
              serviceName: CSP_IDS.ID_ME,
            },
          },
        },
      };
      const result = mapStateToProps(state);
      expect(result.userIsLoggedIn).to.eql(true);
      expect(result.serviceName).to.eql(CSP_IDS.ID_ME);
      expect(result.userIsVerified).to.eql(true);
    });
  });

  describe('render widget', () => {
    const mockStore = configureStore([]);
    const serviceDescription = 'order supplies';
    const linkText = 'order medical supplies';

    /**
     * Creates an HTML Collection with a div and a link.
     * @returns the HTML Collection
     */
    const noAlertContent = () => {
      // The link
      const linkEl = document.createElement('a');
      linkEl.appendChild(document.createTextNode(linkText));
      linkEl.href = '/health-care/order-medical-supplies/';
      linkEl.title = linkText;

      // The widget content div
      const widgetContent = document.createElement('div');
      widgetContent.className = 'static-widget-content';
      widgetContent.appendChild(linkEl);
      return widgetContent;
    };

    it('unanthenticated user', async () => {
      const { queryByTestId, queryByRole, getByText } = render(
        <Provider store={mockStore()}>
          <MhvSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn={false}
            noAlertContent={noAlertContent()}
          />
        </Provider>,
      );
      expect(queryByTestId('mhv-unverified-alert')).to.be.null;
      expect(queryByTestId('mhv-unauthenticated-alert')).to.exist;
      expect(getByText(RegExp(serviceDescription))).to.exist;
      expect(queryByRole('link', { name: RegExp(linkText) })).to.not.exist;
    });

    it('unverified user', async () => {
      const { queryByTestId, queryByRole, getByText } = render(
        <Provider store={mockStore()}>
          <MhvSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn
            userIsVerified={false}
            serviceName={CSP_IDS.ID_ME}
            noAlertContent={noAlertContent()}
          />
        </Provider>,
      );
      expect(queryByTestId('mhv-unverified-alert')).to.exist;
      expect(getByText(RegExp(serviceDescription))).to.exist;
      expect(queryByTestId('mhv-unauthenticated-alert')).to.be.null;
      expect(queryByRole('link', { name: RegExp(linkText) })).to.not.exist;
    });

    it('verified user', async () => {
      const { queryByTestId, queryByRole } = render(
        <Provider store={mockStore()}>
          <MhvSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn
            userIsVerified
            serviceName={CSP_IDS.ID_ME}
            noAlertContent={noAlertContent()}
          />
        </Provider>,
      );
      expect(queryByTestId('mhv-unverified-alert')).to.be.null;
      expect(queryByTestId('mhv-unauthenticated-alert')).to.be.null;
      expect(queryByRole('link', { name: RegExp(linkText) })).to.exist;
    });
  });
});
