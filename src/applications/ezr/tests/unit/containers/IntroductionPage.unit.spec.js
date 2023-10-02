import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import formConfig from '../../../config/form';
import content from '../../../locales/en/content.json';
import IntroductionPage from '../../../containers/IntroductionPage';

describe('ezr IntroductionPage', () => {
  const getData = ({ showLoader }) => ({
    props: {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    },
    mockStore: {
      getState: () => ({
        enrollmentStatus: {
          loading: showLoader,
          parsedStatus: 'noneOfTheAbove',
          hasServerError: false,
        },
        form: {
          formId: formConfig.formId,
          data: {},
          loadedData: {
            metadata: {},
          },
          lastSavedDate: null,
          migrations: [],
          prefillTransformer: null,
        },
        user: {
          login: { currentlyLoggedIn: false },
          profile: {
            loading: showLoader,
            loa: { current: null },
            savedForms: [],
            prefillsAvailable: [],
          },
        },
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get: () => {} },
          dismissedDowntimeWarnings: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  describe('when the page renders', () => {
    context('when enrollment status is loading', () => {
      it('should render `va-loading-indicator` with correct message', () => {
        const { props, mockStore } = getData({
          showLoader: true,
        });
        const { container } = render(
          <Provider store={mockStore}>
            <IntroductionPage {...props} />
          </Provider>,
        );
        const selector = container.querySelector('va-loading-indicator');
        expect(selector).to.exist;
        expect(selector).to.contain.attr(
          'message',
          content['load-enrollment-status'],
        );
      });
    });

    context('when enrollment status has finished loading', () => {
      it('should render page contents', () => {
        const { props, mockStore } = getData({
          showLoader: false,
        });
        const { container } = render(
          <Provider store={mockStore}>
            <IntroductionPage {...props} />
          </Provider>,
        );
        const selectors = {
          title: container.querySelector('[data-testid="form-title"]'),
          sipInfo: container.querySelector('[data-testid="ezr-login-alert"]'),
          ombInfo: container.querySelector('va-omb-info'),
        };
        expect(selectors.title).to.exist;
        expect(selectors.sipInfo).to.exist;
        expect(selectors.ombInfo).to.exist;
      });
    });
  });
});
