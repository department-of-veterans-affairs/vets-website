import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { mockFetch, resetFetch } from '~/platform/testing/unit/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';
import { wait } from '@@profile/tests/unit-test-helpers';
import HealthCare from '~/applications/personalization/dashboard-2/components/health-care/HealthCare';

describe('HealthCare component', () => {
  let view;
  let initialState;

  describe('data loading', () => {
    context('when user has the `messaging` service', () => {
      beforeEach(() => {
        window.VetsGov = { pollTimeout: 1 };
        mockFetch();
        initialState = {
          user: {
            profile: {
              services: ['messaging', 'rx'],
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

        view = renderInReduxProvider(<HealthCare />, {
          initialState,
          reducers,
        });
      });
      afterEach(() => {
        resetFetch();
      });
      it('should attempt to get messaging data', async () => {
        await wait(1);
        const fetchCalls = global.fetch.getCalls();
        // make sure we are fetching messaging folders
        expect(
          fetchCalls.some(call => {
            return call.args[0].includes('v0/messaging/health/folders/0');
          }),
        ).to.be.true;
      });

      // it('should render the unread messages count', () => {
      //   expect(view.getByText(new RegExp(`you have 3 new messages`, 'i'))).to
      //     .exist;
      // });
    });

    context('when user lacks the `messaging` service', () => {
      beforeEach(() => {
        mockFetch();
        initialState = {
          user: {
            profile: {
              services: [''],
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
              },
            },
          },
        };
        view = renderInReduxProvider(<HealthCare />, {
          initialState,
          reducers,
        });
      });
      afterEach(() => {
        resetFetch();
      });
      it('should not attempt to get messaging data', async () => {
        await wait(1);
        const fetchCalls = global.fetch.getCalls();
        // make sure we are not fetching messaging folders
        expect(
          fetchCalls.some(call => {
            return call.args[0].includes('v0/messaging/health/folders/0');
          }),
        ).to.be.false;
      });
    });
  });

  // describe('Messaging', () => {
  //   describe('when eligible for messaging', () => {
  //     it('should render the unread messages count', () => {
  //       const unreadMessagesCount = 3;
  //       const props = { ...defaultProps(), unreadMessagesCount };
  //       const view = render(<HealthCare {...props} />);
  //       expect(
  //         view.getByText(
  //           new RegExp(
  //             `you have.*${props.unreadMessagesCount} new messages`,
  //             'i',
  //           ),
  //         ),
  //       ).to.exist;
  //     });

  //     it('should render "View all new messages"', () => {
  //       const view = render(<HealthCare {...defaultProps()} />);
  //       expect(view.getByText('View your new messages')).to.exist;
  //     });
  //   });

  //   describe('when not eligible for messaging', () => {
  //     it('should not render', () => {
  //       const canAccessMessaging = false;
  //       const props = { ...defaultProps(), canAccessMessaging };
  //       const view = render(<HealthCare {...props} />);
  //       expect(view.getByText(new RegExp(`messages`, 'i'))).to.not.exist;
  //     });
  //   });
  // });
});
