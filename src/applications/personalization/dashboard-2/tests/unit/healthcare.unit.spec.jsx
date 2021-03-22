import React from 'react';
import { expect } from 'chai';
import { mockFetch, resetFetch } from '~/platform/testing/unit/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';
import { wait } from '@@profile/tests/unit-test-helpers';
import HealthCare from '~/applications/personalization/dashboard-2/components/health-care/HealthCare';

describe('HealthCare component', () => {
  let view;
  let initialState;

  context('when user has the `messaging` service', () => {
    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      mockFetch();
      initialState = {
        user: {
          profile: {
            services: ['messaging'],
          },
        },
        health: {
          appointments: {
            data: [],
          },
          msg: {
            folders: {
              data: {
                currentItem: {
                  attributes: {
                    unreadCount: 3,
                  },
                },
              },
              ui: {
                nav: {
                  foldersExpanded: false,
                  visible: false,
                },
              },
            },
          },
        },
      };
    });
    afterEach(() => {
      resetFetch();
    });

    it('should attempt to get messaging data', async () => {
      view = renderInReduxProvider(<HealthCare />, {
        initialState,
        reducers,
      });
      await wait(1);
      const fetchCalls = global.fetch.getCalls();
      // make sure we are fetching messaging folders
      expect(
        fetchCalls.some(call => {
          return call.args[0].includes('v0/messaging/health/folders/0');
        }),
      ).to.be.true;
    });

    it('should render the unread messages count', async () => {
      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });
      expect(await view.findByText(new RegExp(`you have 3 new messages`, 'i')))
        .to.exist;
    });
  });

  context('when user lacks the `messaging` service', () => {
    beforeEach(() => {
      mockFetch();
      initialState = {
        user: {
          profile: {
            services: [],
          },
        },
        health: {
          appointments: {
            data: [],
          },
          msg: {
            folders: {
              data: {
                currentItem: {
                  attributes: {
                    unreadCount: 0,
                  },
                },
              },
              ui: {
                nav: {
                  foldersExpanded: false,
                  visible: false,
                },
              },
            },
          },
        },
      };
    });
    afterEach(() => {
      resetFetch();
    });
    it('should not attempt to get messaging data', async () => {
      view = renderInReduxProvider(<HealthCare />, {
        initialState,
        reducers,
      });
      await wait(1);
      const fetchCalls = global.fetch.getCalls();
      // make sure we are not fetching messaging folders
      expect(
        fetchCalls.some(call => {
          return call.args[0].includes('v0/messaging/health/folders/0');
        }),
      ).to.be.false;
    });

    it('should not render Messages', () => {
      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });
      expect(view.queryByText(new RegExp(`Messages`, 'i'))).not.to.exist;
    });
  });
});
