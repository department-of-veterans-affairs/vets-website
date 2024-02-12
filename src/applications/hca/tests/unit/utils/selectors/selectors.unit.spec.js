import { expect } from 'chai';
import * as selectors from '../../../../utils/selectors';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';

const basicEnrollmentStatusState = {
  applicationDate: null,
  enrollmentDate: null,
  preferredFacility: null,
  enrollmentStatus: null,
  hasServerError: false,
  isLoadingApplicationStatus: false,
  isLoadingDismissedNotification: false,
  isUserInMVI: false,
  loginRequired: false,
  noESRRecordFound: false,
  showReapplyContent: false,
};
const loggedOutUserState = {
  login: {
    currentlyLoggedIn: false,
  },
  profile: {
    loa: {
      current: null,
      highest: null,
    },
    verified: false,
    loading: false,
  },
};
const loadingUserState = {
  login: {
    currentlyLoggedIn: false,
  },
  profile: {
    loa: {
      current: null,
      highest: null,
    },
    verified: false,
    loading: true,
  },
};
const LOA3UserState = {
  login: {
    currentlyLoggedIn: true,
  },
  profile: {
    loa: {
      current: 3,
      highest: 3,
    },
    verified: true,
    loading: false,
    status: 'OK',
  },
};
const LOA1UserState = {
  login: {
    currentlyLoggedIn: true,
  },
  profile: {
    loa: {
      current: 1,
      highest: 1,
    },
    verified: true,
    loading: false,
  },
};

// describe('when the profile is loading', () => {});

describe('hca top-level selectors', () => {
  describe('when `isLoggedOut` executes', () => {
    describe('when the profile is loading', () => {
      it('should return `false`', () => {
        const state = {
          user: { ...loadingUserState },
        };
        const isLoggedOut = selectors.isLoggedOut(state);
        expect(isLoggedOut).to.be.false;
      });
    });

    describe('when the profile is not loading', () => {
      describe('when the user is not logged in', () => {
        it('should return `true`', () => {
          const state = {
            user: { ...loggedOutUserState },
          };
          const isLoggedOut = selectors.isLoggedOut(state);
          expect(isLoggedOut).to.be.true;
        });
      });

      describe('when the user is logged in', () => {
        it('should return `false`', () => {
          const state = {
            user: { ...LOA3UserState },
          };
          const isLoggedOut = selectors.isLoggedOut(state);
          expect(isLoggedOut).to.be.false;
        });
      });
    });
  });

  describe('when `selectEnrollmentStatus` executes', () => {
    it('should select the correct part of the state', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        user: { ...loggedOutUserState },
      };
      const enrollmentStatus = selectors.selectEnrollmentStatus(state);
      expect(enrollmentStatus).to.deep.equal(basicEnrollmentStatusState);
    });
  });

  describe('when `isEnrollmentStatusLoading` executes', () => {
    it('should return the correct part of the enrollment status state', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
      };
      let isLoading = selectors.isEnrollmentStatusLoading(state);
      expect(isLoading).to.be.false;
      state.hcaEnrollmentStatus.isLoadingApplicationStatus = true;
      isLoading = selectors.isEnrollmentStatusLoading(state);
      expect(isLoading).to.be.true;
    });
  });

  describe('when `hasServerError` executes', () => {
    it('should return the correct part of the enrollment status state', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
      };
      let hasServerError = selectors.hasServerError(state);
      expect(hasServerError).to.be.false;
      state.hcaEnrollmentStatus.hasServerError = true;
      hasServerError = selectors.hasServerError(state);
      expect(hasServerError).to.be.true;
    });
  });

  describe('when `noESRRecordFound` executes', () => {
    it('should return the correct part of the enrollment status state', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
      };
      let noESRRecordFound = selectors.noESRRecordFound(state);
      expect(noESRRecordFound).to.be.false;
      state.hcaEnrollmentStatus.noESRRecordFound = true;
      noESRRecordFound = selectors.noESRRecordFound(state);
      expect(noESRRecordFound).to.be.true;
    });
  });

  describe('when `shouldShowReapplyContent` executes', () => {
    it('should return the correct part of the enrollment status state', () => {
      const state = {
        hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
      };
      let showReapplyContent = selectors.shouldShowReapplyContent(state);
      expect(showReapplyContent).to.be.false;
      state.hcaEnrollmentStatus.showReapplyContent = true;
      showReapplyContent = selectors.shouldShowReapplyContent(state);
      expect(showReapplyContent).to.be.true;
    });
  });

  describe('when `isEnrolledInESR` executes', () => {
    describe('when the enrollmentStatus is not set', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        };
        const isEnrolledInESR = selectors.isEnrolledInESR(state);
        expect(isEnrolledInESR).to.be.false;
      });
    });

    describe('when the enrollmentStatus is `not enrolled`', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
            enrollmentStatus: HCA_ENROLLMENT_STATUSES.pendingOther,
          },
        };
        const isEnrolledInESR = selectors.isEnrolledInESR(state);
        expect(isEnrolledInESR).to.be.false;
      });
    });

    describe('when the enrollmentStatus is `enrolled`', () => {
      it('should return `true`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
            enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
          },
        };
        const isEnrolledInESR = selectors.isEnrolledInESR(state);
        expect(isEnrolledInESR).to.be.true;
      });
    });
  });

  describe('when `isInESR` executes', () => {
    describe('when the enrollmentStatus is not set', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
        };
        const isInESR = selectors.hasApplicationInESR(state);
        expect(isInESR).to.be.false;
      });
    });

    describe('when the enrollmentStatus is `noneOfTheAbove`', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
            enrollmentStatus: HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
          },
        };
        const isInESR = selectors.hasApplicationInESR(state);
        expect(isInESR).to.be.false;
      });
    });

    describe('when the enrollmentStatus is `activeDuty`', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
            enrollmentStatus: HCA_ENROLLMENT_STATUSES.activeDuty,
          },
        };
        const isInESR = selectors.hasApplicationInESR(state);
        expect(isInESR).to.be.false;
      });
    });

    describe('when the enrollmentStatus is `cancelled`', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
            enrollmentStatus: HCA_ENROLLMENT_STATUSES.canceledDeclined,
          },
        };
        const isInESR = selectors.hasApplicationInESR(state);
        expect(isInESR).to.be.false;
      });
    });

    describe('when the enrollmentStatus is `deceased`', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
            enrollmentStatus: HCA_ENROLLMENT_STATUSES.deceased,
          },
        };
        const isInESR = selectors.hasApplicationInESR(state);
        expect(isInESR).to.be.false;
      });
    });

    describe('when the enrollmentStatus is `enrolled`', () => {
      it('should return `true`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
            enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
          },
        };
        const isInESR = selectors.hasApplicationInESR(state);
        expect(isInESR).to.be.true;
      });
    });

    describe('when the enrollmentStatus is `pending`', () => {
      it('should return `true`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
            enrollmentStatus: HCA_ENROLLMENT_STATUSES.pendingOther,
          },
        };
        const isInESR = selectors.hasApplicationInESR(state);
        expect(isInESR).to.be.true;
      });
    });
  });
});

describe('hca compound selectors', () => {
  describe('when `isLoading` executes', () => {
    describe('when the enrollment status is loading', () => {
      it('should return `true`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
            isLoadingApplicationStatus: true,
          },
          user: { ...loggedOutUserState },
        };
        const isLoading = selectors.isLoading(state);
        expect(isLoading).to.be.true;
      });
    });

    describe('when the profile is loading', () => {
      it('should return `true`', () => {
        const state = {
          hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
          user: { ...loadingUserState },
        };
        const isLoading = selectors.isLoading(state);
        expect(isLoading).to.be.true;
      });
    });

    describe('when neither the profile or enrollment status is loading', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
          user: { ...loggedOutUserState },
        };
        const isLoading = selectors.isLoading(state);
        expect(isLoading).to.be.false;
      });
    });
  });

  describe('when `isUserLOA1` executes', () => {
    describe('when the user is logged out', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
          user: { ...loggedOutUserState },
        };
        const isLOA1 = selectors.isUserLOA1(state);
        expect(isLOA1).to.be.false;
      });
    });

    describe('when the user is logged in', () => {
      describe('when the enrollment status is loading', () => {
        it('should return `false`', () => {
          const state = {
            hcaEnrollmentStatus: {
              ...basicEnrollmentStatusState,
              isLoadingApplicationStatus: true,
            },
            user: { ...LOA1UserState },
          };
          const isLOA1 = selectors.isUserLOA1(state);
          expect(isLOA1).to.be.false;
        });
      });

      describe('when the profile is loading', () => {
        it('should return `false`', () => {
          const state = {
            hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
            user: { ...loadingUserState },
          };
          const isLOA1 = selectors.isUserLOA1(state);
          expect(isLOA1).to.be.false;
        });
      });

      describe('when everything has loaded', () => {
        describe('when the user is LOA1', () => {
          it('should return `true`', () => {
            const state = {
              hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
              user: { ...LOA1UserState },
            };
            const isLOA1 = selectors.isUserLOA1(state);
            expect(isLOA1).to.be.true;
          });
        });

        describe('when the user is LOA3', () => {
          it('should return `false`', () => {
            const state = {
              hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
              user: { ...LOA3UserState },
            };
            const isLOA1 = selectors.isUserLOA1(state);
            expect(isLOA1).to.be.false;
          });
        });
      });
    });
  });

  describe('when `isUserLOA3` executes', () => {
    describe('when the user is logged out', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
          user: { ...loggedOutUserState },
        };
        const isLOA3 = selectors.isUserLOA3(state);
        expect(isLOA3).to.be.false;
      });
    });

    describe('when the user is logged in', () => {
      describe('when the enrollment status is loading', () => {
        describe('when the user has resolved', () => {
          it('should return `true`', () => {
            const state = {
              hcaEnrollmentStatus: {
                ...basicEnrollmentStatusState,
                isLoadingApplicationStatus: true,
              },
              user: { ...LOA3UserState },
            };
            const isLOA3 = selectors.isUserLOA3(state);
            expect(isLOA3).to.be.true;
          });
        });
      });

      describe('when the profile is loading', () => {
        it('should return `false`', () => {
          const state = {
            hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
            user: { ...loadingUserState },
          };
          const isLOA3 = selectors.isUserLOA3(state);
          expect(isLOA3).to.be.false;
        });
      });

      describe('when everything has loaded', () => {
        describe('when the user is LOA1', () => {
          it('should return `false`', () => {
            const state = {
              hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
              user: { ...LOA1UserState },
            };
            const isLOA3 = selectors.isUserLOA3(state);
            expect(isLOA3).to.be.false;
          });
        });

        describe('when the user is LOA3', () => {
          it('should return `true`', () => {
            const state = {
              hcaEnrollmentStatus: { ...basicEnrollmentStatusState },
              user: { ...LOA3UserState },
            };
            const isLOA3 = selectors.isUserLOA3(state);
            expect(isLOA3).to.be.true;
          });
        });

        describe('when the user is not found in ESR', () => {
          it('should return `false`', () => {
            const state = {
              hcaEnrollmentStatus: {
                ...basicEnrollmentStatusState,
                noESRRecordFound: true,
              },
              user: { ...LOA3UserState },
            };
            const isLOA3 = selectors.isUserLOA3(state);
            expect(isLOA3).to.be.false;
          });
        });
      });

      describe('when there is a server error', () => {
        it('should return `false`', () => {
          const state = {
            hcaEnrollmentStatus: {
              ...basicEnrollmentStatusState,
              hasServerError: true,
            },
            user: { ...LOA3UserState },
          };
          const isLOA3 = selectors.isUserLOA3(state);
          expect(isLOA3).to.be.false;
        });
      });
    });
  });

  describe('when `shouldShowGetStartedContent` executes', () => {
    describe('when the user is logged out', () => {
      it('should return `true`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
          },
          user: { ...loggedOutUserState },
        };
        const shouldShowGetStartedContent = selectors.shouldShowGetStartedContent(
          state,
        );
        expect(shouldShowGetStartedContent).to.be.true;
      });
    });

    describe('when the user is logged in', () => {
      describe('default behavior', () => {
        it('should return `false`', () => {
          const state = {
            hcaEnrollmentStatus: {
              ...basicEnrollmentStatusState,
            },
            user: { ...LOA3UserState },
          };
          const shouldShowGetStartedContent = selectors.shouldShowGetStartedContent(
            state,
          );
          expect(shouldShowGetStartedContent).to.be.false;
        });
      });

      describe('when there is a server error', () => {
        it('should return `true`', () => {
          const state = {
            hcaEnrollmentStatus: {
              ...basicEnrollmentStatusState,
              hasServerError: true,
            },
            user: { ...LOA3UserState },
          };
          const shouldShowGetStartedContent = selectors.shouldShowGetStartedContent(
            state,
          );
          expect(shouldShowGetStartedContent).to.be.true;
        });
      });

      describe('when the user is not found in ESR', () => {
        it('should return `true`', () => {
          const state = {
            hcaEnrollmentStatus: {
              ...basicEnrollmentStatusState,
              noESRRecordFound: true,
            },
            user: { ...LOA3UserState },
          };
          const shouldShowGetStartedContent = selectors.shouldShowGetStartedContent(
            state,
          );
          expect(shouldShowGetStartedContent).to.be.true;
        });
      });
    });
  });

  describe('when `shouldHideFormFooter` executes', () => {
    describe('when the enrollment status is loading', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
            isLoadingApplicationStatus: true,
          },
          user: { ...LOA1UserState },
        };
        const shouldHideFormFooter = selectors.shouldHideFormFooter(state);
        expect(shouldHideFormFooter).to.be.false;
      });
    });

    describe('when the profile is loading', () => {
      it('should return `false`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
          },
          user: { ...loadingUserState },
        };
        const shouldHideFormFooter = selectors.shouldHideFormFooter(state);
        expect(shouldHideFormFooter).to.be.false;
      });
    });

    describe('when the user is LOA1', () => {
      it('should return `true`', () => {
        const state = {
          hcaEnrollmentStatus: {
            ...basicEnrollmentStatusState,
          },
          user: { ...LOA1UserState },
        };
        const shouldHideFormFooter = selectors.shouldHideFormFooter(state);
        expect(shouldHideFormFooter).to.be.true;
      });
    });

    describe('when the user is LOA3', () => {
      describe('when the reapply content is not rendered', () => {
        it('should return `true`', () => {
          const state = {
            hcaEnrollmentStatus: {
              ...basicEnrollmentStatusState,
            },
            user: { ...LOA3UserState },
          };
          const shouldHideFormFooter = selectors.shouldHideFormFooter(state);
          expect(shouldHideFormFooter).to.be.true;
        });
      });

      describe('when the reapply content is rendered', () => {
        it('should return `false`', () => {
          const state = {
            hcaEnrollmentStatus: {
              ...basicEnrollmentStatusState,
              showReapplyContent: true,
            },
            user: { ...LOA3UserState },
          };
          const shouldHideFormFooter = selectors.shouldHideFormFooter(state);
          expect(shouldHideFormFooter).to.be.false;
        });
      });
    });
  });
});
