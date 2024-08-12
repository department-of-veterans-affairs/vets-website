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
    const noAlertContent = () => {
      const linkEl = document.createElement('a');
      linkEl.appendChild(document.createTextNode(linkText));
      linkEl.href = '/health-care/order-medical-supplies/';
      linkEl.title = linkText;
      const docFragment = document.createDocumentFragment();
      docFragment.appendChild(linkEl);
      return docFragment.children;
    };

    it('unanthenticated user', async () => {
      const { queryByRole, queryByText } = render(
        <Provider store={mockStore()}>
          <MhvSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn={false}
            noAlertContent={noAlertContent()}
          >
            <a href="/health-care/order-medical-supplies/">{linkText}</a>
          </MhvSigninCallToAction>
        </Provider>,
      );
      expect(
        queryByRole('heading', { name: RegExp(unanthenticatedHeadingPrefix) }),
      ).to.exist;
      expect(queryByRole('heading', { name: RegExp(unverfiedHeadingPrefix) }))
        .to.be.null;
      expect(queryByText(linkText)).to.be.null;
    });

    it('unverified user', async () => {
      const { queryByRole, queryByText } = render(
        <Provider store={mockStore()}>
          <MhvSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn
            userIsVerified={false}
            serviceName={CSP_IDS.ID_ME}
            noAlertContent={noAlertContent()}
          >
            <a href="/health-care/order-medical-supplies/">{linkText}</a>
          </MhvSigninCallToAction>
        </Provider>,
      );
      expect(
        queryByRole('heading', { name: RegExp(unanthenticatedHeadingPrefix) }),
      ).to.be.null;
      expect(queryByRole('heading', { name: RegExp(unverfiedHeadingPrefix) }))
        .to.exist;
      expect(queryByText(linkText)).to.be.null;
    });

    it('verified user', async () => {
      const { queryByRole, queryByText } = render(
        <Provider store={mockStore()}>
          <MhvSigninCallToAction
            serviceDescription={serviceDescription}
            userIsLoggedIn
            userIsVerified
            serviceName={CSP_IDS.ID_ME}
            noAlertContent={noAlertContent()}
          >
            <a href="/health-care/order-medical-supplies/">{linkText}</a>
          </MhvSigninCallToAction>
        </Provider>,
      );
      expect(
        queryByRole('heading', { name: RegExp(unanthenticatedHeadingPrefix) }),
      ).to.be.null;
      expect(queryByRole('heading', { name: RegExp(unverfiedHeadingPrefix) }))
        .to.be.null;
      expect(queryByText(linkText)).to.exist;
    });
  });
});
