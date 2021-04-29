import React from 'react';
import { expect } from 'chai';

import { mockFetch, resetFetch } from '~/platform/testing/unit/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';

import reducers from '~/applications/personalization/dashboard/reducers';
import { wait } from '@@profile/tests/unit-test-helpers';
import ApplyForBenefits from './ApplyForBenefits';

const oneDayInMS = 24 * 60 * 60 * 1000;
const oneWeekInMS = oneDayInMS * 7;
const oneYearInMS = oneDayInMS * 365;

function oneWeekAgo() {
  return Date.now() - oneWeekInMS;
}

function oneDayAgo() {
  return Date.now() - oneDayInMS;
}

function oneDayFromNow() {
  return Date.now() + oneDayInMS;
}

function oneWeekFromNow() {
  return Date.now() + oneWeekInMS;
}

function oneYearFromNow() {
  return Date.now() + oneYearInMS;
}

function loadingSpinnerIsHidden(view) {
  expect(
    view.queryByRole('progressbar', {
      value: /benefits you might be interested in/i,
    }),
  ).to.not.exist;
}

function noApplicationsInProgressShown(view, shown = true) {
  const regex = /you have no applications in progress/i;
  if (shown) {
    view.getByText(regex);
  } else {
    expect(view.queryByText(regex)).not.to.exist;
  }
}

function noApplicationsInProgressHidden(view) {
  noApplicationsInProgressShown(view, false);
}

function healthCareInfoIsShown(view, shown = true) {
  const query = [
    'link',
    {
      name: /apply for VA health care/i,
    },
  ];
  if (shown) {
    view.getByRole(...query);
  } else {
    expect(view.queryByRole(...query)).not.to.exist;
  }
}

function claimsInfoIsShown(view) {
  view.getByRole('link', {
    name: /learn how to file a.*claim/i,
  });
}

function educationInfoIsShown(view, shown = true) {
  const query = [
    'link',
    {
      name: /learn how to apply for.*education benefits/i,
    },
  ];
  if (shown) {
    view.getByRole(...query);
  } else {
    expect(view.queryByRole(...query)).to.not.exist;
  }
}

function educationInfoIsHidden(view) {
  educationInfoIsShown(view, false);
}

function healthCareInfoIsHidden(view) {
  healthCareInfoIsShown(view, false);
}

describe('ApplyForBenefits component', () => {
  let view;
  describe('Applications in progress', () => {
    it('renders the correct content when there are no applications in progress', () => {
      const initialState = {
        user: {
          profile: {
            savedForms: [],
            loa: {
              current: 1,
              highest: 3,
            },
          },
        },
      };
      view = renderInReduxProvider(<ApplyForBenefits />, {
        initialState,
        reducers,
      });
      noApplicationsInProgressShown(view);
    });

    it('does not render unknown applications that are in progress', () => {
      const initialState = {
        hcaEnrollmentStatus: { enrollmentStatus: null, hasServerError: false },
        user: {
          profile: {
            loa: {
              current: 1,
              highest: 3,
            },
            savedForms: [
              {
                form: '123-ABC',
                metadata: {
                  version: 3,
                  returnUrl: '/military/reserve-national-guard',
                },
                lastUpdated: oneDayAgo(),
              },
            ],
          },
        },
      };
      view = renderInReduxProvider(<ApplyForBenefits />, {
        initialState,
        reducers,
      });
      noApplicationsInProgressShown(view);
    });

    it('does not render applications-in-progress that have expired', () => {
      const initialState = {
        hcaEnrollmentStatus: { enrollmentStatus: null, hasServerError: false },
        user: {
          profile: {
            loa: {
              current: 1,
              highest: 3,
            },
            savedForms: [
              {
                form: '21-526EZ',
                metadata: {
                  version: 1,
                  returnUrl: '/net-worth',
                  savedAt: oneWeekAgo(),
                  submission: {
                    status: false,
                    errorMessage: false,
                    id: false,
                    timestamp: false,
                    hasAttemptedSubmit: false,
                  },
                  expiresAt: oneWeekAgo() / 1000,
                  lastUpdated: oneWeekAgo() / 1000,
                  inProgressFormId: 5179,
                },
                lastUpdated: oneWeekAgo() / 1000,
              },
            ],
          },
        },
      };
      view = renderInReduxProvider(<ApplyForBenefits />, {
        initialState,
        reducers,
      });
      noApplicationsInProgressShown(view);
    });

    it('sorts the in-progress applications, listing the soonest-to-expire applications first', () => {
      const initialState = {
        user: {
          profile: {
            loa: {
              current: 1,
              highest: 3,
            },
            savedForms: [
              {
                form: '686C-674',
                metadata: {
                  version: 1,
                  returnUrl: '/net-worth',
                  savedAt: oneDayAgo(),
                  submission: {
                    status: false,
                    errorMessage: false,
                    id: false,
                    timestamp: false,
                    hasAttemptedSubmit: false,
                  },
                  expiresAt: oneWeekFromNow() / 1000,
                  lastUpdated: oneDayAgo() / 1000,
                  inProgressFormId: 5179,
                },
                lastUpdated: oneDayAgo() / 1000,
              },
              {
                form: '21-526EZ',
                metadata: {
                  version: 1,
                  returnUrl: '/net-worth',
                  savedAt: oneDayAgo(),
                  submission: {
                    status: false,
                    errorMessage: false,
                    id: false,
                    timestamp: false,
                    hasAttemptedSubmit: false,
                  },
                  expiresAt: oneDayFromNow() / 1000,
                  lastUpdated: oneDayAgo() / 1000,
                  inProgressFormId: 5179,
                },
                lastUpdated: oneDayAgo() / 1000,
              },
              {
                form: '1010ez',
                metadata: {
                  version: 1,
                  returnUrl: '/net-worth',
                  savedAt: oneDayAgo(),
                  submission: {
                    status: false,
                    errorMessage: false,
                    id: false,
                    timestamp: false,
                    hasAttemptedSubmit: false,
                  },
                  expiresAt: oneYearFromNow() / 1000,
                  lastUpdated: oneDayAgo() / 1000,
                  inProgressFormId: 5179,
                },
                lastUpdated: oneDayAgo() / 1000,
              },
            ],
          },
        },
      };
      view = renderInReduxProvider(<ApplyForBenefits />, {
        initialState,
        reducers,
      });
      noApplicationsInProgressHidden(view);
      const applicationsInProgress = view.getAllByTestId(
        'application-in-progress',
      );
      expect(applicationsInProgress.length).to.equal(3);
      expect(applicationsInProgress[0]).to.contain.text('21-526EZ');
      expect(applicationsInProgress[1]).to.contain.text('686C-674');
      expect(applicationsInProgress[2]).to.contain.text('1010ez');
    });
  });
  describe('Benefits you might be interested in', () => {
    context('when user is not a VA patient and has 2FA set up', () => {
      beforeEach(() => {
        mockFetch();
      });
      afterEach(() => {
        resetFetch();
      });
      it('should fetch ESR and DD4EDU data and show a loading spinner', async () => {
        const initialState = {
          user: {
            profile: {
              vaPatient: false,
              multifactor: true,
              loa: {
                current: 3,
                highest: 3,
              },
            },
          },
        };
        view = renderInReduxProvider(<ApplyForBenefits />, {
          initialState,
          reducers,
        });
        // Because fetch is called as part of an async Redux thunk, we need to
        // wait here before confirming that fetch was called
        await wait(1);
        const fetchCalls = global.fetch.getCalls();
        // make sure we are fetching DD4EDU info
        expect(
          fetchCalls.some(call => {
            return call.args[0].includes('v0/profile/ch33_bank_accounts');
          }),
        ).to.be.true;
        // make sure we are fetching ESR data
        expect(
          fetchCalls.some(call => {
            return call.args[0].includes(
              'v0/health_care_applications/enrollment_status',
            );
          }),
        ).to.be.true;
      });
    });

    context(
      'when user is not a VA patient, not LOA3, and does not have 2FA set up',
      () => {
        beforeEach(() => {
          mockFetch();
        });
        afterEach(() => {
          resetFetch();
        });
        it('should not fetch ESR data or DD4EDU data and show the correct benefits', async () => {
          const initialState = {
            user: {
              profile: {
                vaPatient: false,
                multifactor: false,
                loa: {
                  current: 1,
                  highest: 3,
                },
              },
            },
          };
          view = renderInReduxProvider(<ApplyForBenefits />, {
            initialState,
            reducers,
          });
          // Because fetch is called as part of an async Redux thunk, we need to
          // wait here before confirming that fetch was called
          await wait(1);
          const fetchCalls = global.fetch.getCalls();
          // make sure we are _not_ fetching DD4EDU info
          expect(
            fetchCalls.some(call => {
              return call.args[0].includes('v0/profile/ch33_bank_accounts');
            }),
          ).to.be.false;
          // make sure we are _not_ fetching ESR data
          expect(
            fetchCalls.some(call => {
              return call.args[0].includes(
                'v0/health_care_applications/enrollment_status',
              );
            }),
          ).to.be.false;
          // make sure the loading spinner is not shown since we didn't need to load anything
          loadingSpinnerIsHidden(view);

          healthCareInfoIsShown(view);
          claimsInfoIsShown(view);
          educationInfoIsShown(view);
        });
      },
    );

    context('when user is a VA patient and does not have 2FA set up', () => {
      beforeEach(() => {
        mockFetch();
      });
      afterEach(() => {
        resetFetch();
      });
      it('should not fetch data from ESR and DD4EDU and not show a loading spinner', async () => {
        const initialState = {
          user: {
            profile: {
              loa: {
                current: 3,
                highest: 3,
              },
              vaPatient: true,
              multifactor: false,
            },
          },
        };
        view = renderInReduxProvider(<ApplyForBenefits />, {
          initialState,
          reducers,
        });
        // Because fetch is called as part of an async Redux thunk, we need to
        // wait here before confirming that fetch was called or not called.
        await wait(1);
        const fetchCalls = global.fetch.getCalls();
        // make sure we are not fetching DD4EDU info
        expect(
          fetchCalls.some(call => {
            return call.args[0].includes('v0/profile/ch33_bank_accounts');
          }),
        ).to.be.false;
        // make sure we are not fetching ESR data
        expect(
          fetchCalls.some(call => {
            return call.args[0].includes(
              'v0/health_care_applications/enrollment_status',
            );
          }),
        ).to.be.false;
        loadingSpinnerIsHidden(view);
      });
    });

    context(
      'when user is not a VA patient, is not in ESR, and not enrolled in DD4edu',
      () => {
        it('should show the correct benefits', () => {
          const initialState = {
            user: {
              profile: {
                vaPatient: false,
                multifactor: true,
                loa: {
                  current: 1,
                  highest: 3,
                },
              },
            },
            hcaEnrollmentStatus: {
              noESRRecordFound: true,
            },
            vaProfile: {
              eduPaymentInformation: {
                error: true,
              },
            },
          };
          view = renderInReduxProvider(<ApplyForBenefits />, {
            initialState,
            reducers,
          });
          healthCareInfoIsShown(view);
          claimsInfoIsShown(view);
          educationInfoIsShown(view);
        });
      },
    );

    context(
      'when user is not a VA patient, is not in ESR, but has a non-expired health care application in progress',
      () => {
        it('should not show info about health care benefits', () => {
          const initialState = {
            user: {
              profile: {
                vaPatient: false,
                multifactor: false,
                loa: {
                  current: 1,
                  highest: 3,
                },
                savedForms: [
                  {
                    form: '1010ez',
                    metadata: {
                      version: 1,
                      returnUrl: '/net-worth',
                      savedAt: oneDayAgo(),
                      submission: {
                        status: false,
                        errorMessage: false,
                        id: false,
                        timestamp: false,
                        hasAttemptedSubmit: false,
                      },
                      expiresAt: oneYearFromNow() / 1000,
                      lastUpdated: oneDayAgo() / 1000,
                      inProgressFormId: 5179,
                    },
                    lastUpdated: oneDayAgo() / 1000,
                  },
                ],
              },
            },
            hcaEnrollmentStatus: {
              noESRRecordFound: true,
            },
          };
          view = renderInReduxProvider(<ApplyForBenefits />, {
            initialState,
            reducers,
          });
          // this assertion is to make sure that a loading spinner is not
          // rendered
          educationInfoIsShown(view);
          healthCareInfoIsHidden(view);
        });
      },
    );

    context(
      'when user is not a VA patient, is not in ESR, and has an expired health care application in progress',
      () => {
        it('should show info about health care benefits', () => {
          const initialState = {
            user: {
              profile: {
                vaPatient: false,
                multifactor: false,
                loa: {
                  current: 1,
                  highest: 3,
                },
                savedForms: [
                  {
                    form: '1010ez',
                    metadata: {
                      version: 1,
                      returnUrl: '/net-worth',
                      savedAt: oneDayAgo(),
                      submission: {
                        status: false,
                        errorMessage: false,
                        id: false,
                        timestamp: false,
                        hasAttemptedSubmit: false,
                      },
                      expiresAt: oneDayAgo() / 1000,
                      lastUpdated: oneDayAgo() / 1000,
                      inProgressFormId: 5179,
                    },
                    lastUpdated: oneDayAgo() / 1000,
                  },
                ],
              },
            },
            hcaEnrollmentStatus: {
              noESRRecordFound: true,
            },
          };
          view = renderInReduxProvider(<ApplyForBenefits />, {
            initialState,
            reducers,
          });
          healthCareInfoIsShown(view);
          educationInfoIsShown(view);
        });
      },
    );

    context(
      'when user is a VA patient, but is in ESR, and is not enrolled in DD4edu',
      () => {
        it('should show the correct benefits', () => {
          const initialState = {
            user: {
              profile: {
                vaPatient: false,
                multifactor: true,
                loa: {
                  current: 1,
                  highest: 3,
                },
              },
            },
            hcaEnrollmentStatus: {
              enrollmentStatus: 'canceled_declined',
              noESRRecordFound: false,
            },
            vaProfile: {
              eduPaymentInformation: {
                error: true,
              },
            },
          };
          view = renderInReduxProvider(<ApplyForBenefits />, {
            initialState,
            reducers,
          });
          healthCareInfoIsHidden(view);
          claimsInfoIsShown(view);
          educationInfoIsShown(view);
        });
      },
    );

    context('when user is a VA patient and not enrolled in DD4edu', () => {
      it('should show the correct benefits', () => {
        const initialState = {
          user: {
            profile: {
              vaPatient: true,
              loa: {
                current: 3,
                highest: 3,
              },
              multifactor: true,
            },
          },
          vaProfile: {
            eduPaymentInformation: {
              error: true,
            },
          },
        };
        view = renderInReduxProvider(<ApplyForBenefits />, {
          initialState,
          reducers,
        });
        healthCareInfoIsHidden(view);
        claimsInfoIsShown(view);
        educationInfoIsShown(view);
      });
    });

    context(
      'when user is not a VA patient, not in ESR, but enrolled in DD4edu',
      () => {
        it('should show the correct benefits', () => {
          const initialState = {
            user: {
              profile: {
                vaPatient: false,
                multifactor: true,
                loa: {
                  current: 1,
                  highest: 3,
                },
              },
            },
            hcaEnrollmentStatus: {
              noESRRecordFound: true,
            },
            vaProfile: {
              eduPaymentInformation: {
                paymentAccount: {
                  accountNumber: '123',
                },
              },
            },
          };
          view = renderInReduxProvider(<ApplyForBenefits />, {
            initialState,
            reducers,
          });
          healthCareInfoIsShown(view);
          claimsInfoIsShown(view);
          educationInfoIsHidden(view);
        });
      },
    );

    context('when user is a VA patient and enrolled in DD4edu', () => {
      it('should show the correct benefits', () => {
        const initialState = {
          user: {
            profile: {
              loa: {
                current: 3,
                highest: 3,
              },
              vaPatient: true,
              multifactor: true,
            },
          },
          vaProfile: {
            eduPaymentInformation: {
              paymentAccount: {
                accountNumber: '123',
              },
            },
          },
        };
        view = renderInReduxProvider(<ApplyForBenefits />, {
          initialState,
          reducers,
        });
        claimsInfoIsShown(view);
        healthCareInfoIsHidden(view);
        educationInfoIsHidden(view);
      });
    });
  });
});
