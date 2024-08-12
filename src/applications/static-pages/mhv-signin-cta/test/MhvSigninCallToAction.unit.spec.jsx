import React from 'react';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { MhvSigninCallToAction, mapStateToProps } from '../index';
import { headingPrefix as unanthenticatedHeadingPrefix } from '../components/messages/UnauthenticatedAlert';
import { headingPrefix as unverfiedHeadingPrefix } from '../components/messages/UnverifiedAlert';

describe('MHV Signin CTA', () => {
  describe('map state properties', () => {
    it('user not logged in', () => {
      const state = {
        user: {
          login: {
            currentlyLoggedIn: false,
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
    const mockStore = createMockStore([]);
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

      // The HTML collection
      const docFragment = document.createDocumentFragment();
      docFragment.appendChild(widgetContent);
      return docFragment.children;
    };

    it('unanthenticated user', async () => {
      const { queryByRole } = render(
        <Provider store={mockStore()}>
          <MhvSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn={false}
            noAlertContent={noAlertContent()}
          />
        </Provider>,
      );
      expect(
        queryByRole('heading', { name: RegExp(unanthenticatedHeadingPrefix) }),
      ).to.exist;
      expect(queryByRole('heading', { name: RegExp(unverfiedHeadingPrefix) }))
        .to.be.null;
      expect(queryByRole('link', { name: RegExp(linkText) })).to.be.null;
    });

    it('unverified user', async () => {
      const { queryByRole } = render(
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
      expect(
        queryByRole('heading', { name: RegExp(unanthenticatedHeadingPrefix) }),
      ).to.be.null;
      expect(queryByRole('heading', { name: RegExp(unverfiedHeadingPrefix) }))
        .to.exist;
      expect(queryByRole('link', { name: RegExp(linkText) })).to.be.null;
    });

    it('verified user', async () => {
      const { queryByRole } = render(
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
      expect(
        queryByRole('heading', { name: RegExp(unanthenticatedHeadingPrefix) }),
      ).to.be.null;
      expect(queryByRole('heading', { name: RegExp(unverfiedHeadingPrefix) }))
        .to.be.null;
      expect(queryByRole('link', { name: RegExp(linkText) })).to.exist;
    });
  });
});
