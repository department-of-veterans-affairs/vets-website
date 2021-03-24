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

  context('when appointments and messaging data are still loading', () => {
    it('should only show a loading spinner', async () => {
      initialState = {
        user: {
          profile: {
            services: ['messaging'],
          },
        },
        health: {
          appointments: {
            fetching: true,
          },
          msg: {
            folders: {
              data: {
                currentItem: {
                  loading: true,
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

      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });
      expect(view.getByRole('progressbar')).to.exist;
      expect(view.queryByText(/Refill and track your prescriptions/i)).not.to
        .exist;
      expect(view.queryByText(/Get your lab and test results/i)).not.to.exist;
      expect(view.queryByText(/Get your VA medical records/i)).not.to.exist;
    });
  });

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

    it('should render the unread messages count with 3 messages', async () => {
      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });
      expect(view.queryByRole('progressbar')).not.to.exist;
      expect(await view.findByText(new RegExp(`you have 3 new messages`, 'i')))
        .to.exist;
    });

    it('should render the unread messages count with 1 message', async () => {
      initialState.health.msg.folders.data.currentItem.attributes.unreadCount = 1;
      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });
      expect(await view.findByText(new RegExp(`you have 1 new message`, 'i')))
        .to.exist;
    });

    it('should render the unread messages count with 0 messages', async () => {
      initialState.health.msg.folders.data.currentItem.attributes.unreadCount = 0;
      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });
      expect(await view.findByText(new RegExp(`you have 0 new messages`, 'i')))
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
                    unreadCount: null,
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

    it('should render a generic message when the number of unread messages was not fetched', async () => {
      initialState.health.msg.folders.data.currentItem.attributes.unreadCount = null;
      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });
      expect(
        await view.findByText(
          new RegExp(`Send a secure message to your health care team`, 'i'),
        ),
      ).to.exist;
    });
  });
});
