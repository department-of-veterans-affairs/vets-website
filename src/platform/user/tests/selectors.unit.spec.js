import { expect } from 'chai';
import * as selectors from '../selectors';

describe('user selectors', () => {
  describe('selectVet360', () => {
    it('pulls out the state.profile.vet360 data', () => {
      const state = {
        user: {
          profile: {
            vet360: {
              email: {
                emailAddress: '123@va.com',
              },
            },
          },
        },
      };
      expect(selectors.selectVet360(state)).to.deep.equal(
        state.user.profile.vet360,
      );
    });
    it('returns undefined if there is no vet360 on the profile', () => {
      const state = {
        user: {
          profile: {},
        },
      };
      expect(selectors.selectVet360(state)).to.be.undefined;
    });
  });

  describe('selectVet360EmailAddress', () => {
    it('pulls out the state.profile.vet360.emailAddress', () => {
      const state = {
        user: {
          profile: {
            vet360: {
              email: {
                createdAt: '2019-10-11T12:42:14.000Z',
                emailAddress: 'testertester2@mail.com',
                effectiveEndDate: null,
                effectiveStartDate: '2019-10-11T12:41:06.000Z',
                id: 70619,
                sourceDate: '2019-10-11T12:41:06.000Z',
                sourceSystemUser: null,
                transactionId: '5fda71d0-7e4c-468c-aee7-21c16405ca1f',
                updatedAt: '2019-10-11T12:42:14.000Z',
                vet360Id: '139281',
              },
            },
          },
        },
      };
      expect(selectors.selectVet360EmailAddress(state)).to.equal(
        state.user.profile.vet360.email.emailAddress,
      );
    });
    it('returns undefined if there is no vet360 on the profile', () => {
      const state = {
        user: {
          profile: {},
        },
      };
      expect(selectors.selectVet360EmailAddress(state)).to.be.undefined;
    });
    it('returns undefined if there is no email', () => {
      const state = {
        user: {
          profile: {
            vet360: {},
          },
        },
      };
      expect(selectors.selectVet360EmailAddress(state)).to.be.undefined;
    });
  });

  describe('phone number selectors', () => {
    const phoneNumberData = {
      areaCode: '415',
      countryCode: '1',
      createdAt: '2019-10-22T13:39:19.000Z',
      extension: null,
      effectiveEndDate: null,
      effectiveStartDate: '2019-10-22T13:41:02.000Z',
      id: 82709,
      isInternational: false,
      isTextable: null,
      isTextPermitted: null,
      isTty: null,
      isVoicemailable: null,
      phoneNumber: '8453210',
      phoneType: 'MOBILE',
      sourceDate: '2019-10-22T13:41:02.000Z',
      sourceSystemUser: null,
      transactionId: '5d83b4cd-da19-42fd-8c90-40382c4b61cb',
      updatedAt: '2019-10-22T13:41:03.000Z',
      vet360Id: '139281',
    };

    describe('selectVet360MobilePhone', () => {
      it('pulls out the state.profile.vet360.mobilePhone data object', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                mobilePhone: phoneNumberData,
              },
            },
          },
        };
        expect(selectors.selectVet360MobilePhone(state)).to.deep.equal(
          state.user.profile.vet360.mobilePhone,
        );
      });
      it('returns undefined if there is no vet360 on the profile', () => {
        const state = {
          user: {
            profile: {},
          },
        };
        expect(selectors.selectVet360MobilePhone(state)).to.be.undefined;
      });
      it('returns undefined if there is no mobile phone', () => {
        const state = {
          user: {
            profile: {
              vet360: {},
            },
          },
        };
        expect(selectors.selectVet360MobilePhone(state)).to.be.undefined;
      });
    });

    describe('selectVet360MobilePhoneString', () => {
      it('pulls out the mobile phone number as a single string if it exists', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                mobilePhone: phoneNumberData,
              },
            },
          },
        };
        expect(selectors.selectVet360MobilePhoneString(state)).to.equal(
          '4158453210',
        );
      });
      it('properly handles phone numbers with an extension', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                mobilePhone: { ...phoneNumberData, extension: '1234' },
              },
            },
          },
        };
        expect(selectors.selectVet360MobilePhoneString(state)).to.equal(
          '4158453210x1234',
        );
      });
      it('properly handles phone numbers with an extension of "0000"', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                mobilePhone: { ...phoneNumberData, extension: '0000' },
              },
            },
          },
        };
        expect(selectors.selectVet360MobilePhoneString(state)).to.equal(
          '4158453210',
        );
      });
    });

    describe('selectVet360HomePhone', () => {
      it('pulls out the state.profile.vet360.homePhone data object', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                homePhone: phoneNumberData,
              },
            },
          },
        };
        expect(selectors.selectVet360HomePhone(state)).to.deep.equal(
          state.user.profile.vet360.homePhone,
        );
      });
      it('returns undefined if there is no vet360 on the profile', () => {
        const state = {
          user: {
            profile: {},
          },
        };
        expect(selectors.selectVet360HomePhone(state)).to.be.undefined;
      });
      it('returns undefined if there is no mobile phone', () => {
        const state = {
          user: {
            profile: {
              vet360: {},
            },
          },
        };
        expect(selectors.selectVet360HomePhone(state)).to.be.undefined;
      });
    });

    describe('selectVet360HomePhoneString', () => {
      it('pulls out the home phone number as a single string if it exists', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                homePhone: phoneNumberData,
              },
            },
          },
        };
        expect(selectors.selectVet360HomePhoneString(state)).to.equal(
          '4158453210',
        );
      });
      it('properly handles phone numbers with an extension', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                homePhone: { ...phoneNumberData, extension: '1234' },
              },
            },
          },
        };
        expect(selectors.selectVet360HomePhoneString(state)).to.equal(
          '4158453210x1234',
        );
      });
    });
  });

  describe('selectPatientFacilities', () => {
    it('pulls out the state.profile.facilities array', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              { facilityId: '983', isCerner: false },
              { facilityId: '984', isCerner: false },
            ],
            isCernerPatient: false,
          },
        },
      };
      expect(selectors.selectPatientFacilities(state)).to.deep.equal(
        state.user.profile.facilities,
      );
    });
    it('returns undefined if there is no facilities on the profile', () => {
      const state = {
        user: {
          profile: {},
        },
      };
      expect(selectors.selectPatientFacilities(state)).to.be.null;
    });
  });
  describe('selectIsCernerOnlyPatient', () => {
    it('should return true if Cerner only', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [{ facilityId: '123', isCerner: true }],
            isCernerPatient: true,
          },
        },
      };
      expect(selectors.selectIsCernerOnlyPatient(state)).to.be.true;
    });
    it('should return false if not Cerner only', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              { facilityId: '123', isCerner: true },
              { facilityId: '124', isCerner: false },
            ],
            isCernerPatient: true,
          },
        },
      };
      expect(selectors.selectIsCernerOnlyPatient(state)).to.be.false;
    });
  });
  describe('selectIsCernerPatient', () => {
    it('should return true if single cerner response', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [{ facilityId: '123', isCerner: true }],
            isCernerPatient: true,
          },
        },
      };
      expect(selectors.selectIsCernerPatient(state)).to.be.true;
    });
    it('should return true if atleast 1 cerner facility', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              { facilityId: '123', isCerner: true },
              { facilityId: '124', isCerner: false },
            ],
            isCernerPatient: true,
          },
        },
      };
      expect(selectors.selectIsCernerPatient(state)).to.be.true;
    });
    it('should return false if no cerner facilities', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [{ facilityId: '124', isCerner: false }],
            isCernerPatient: false,
          },
        },
      };
      expect(selectors.selectIsCernerPatient(state)).to.be.false;
    });
  });

  describe('isInMPI', () => {
    it('returns `true` if the profile.status is `OK`', () => {
      const state = {
        user: {
          profile: {
            status: 'OK',
          },
        },
      };
      expect(selectors.isInMPI(state)).to.be.true;
    });
    it('returns `false` if the profile.status is anything other than `OK`', () => {
      const state = {
        user: {
          profile: {
            status: 'blah',
          },
        },
      };
      expect(selectors.isInMPI(state)).to.be.false;
      delete state.user.profile;
      expect(selectors.isInMPI(state)).to.be.false;
    });
  });

  describe('hasMPIConnectionError', () => {
    it('returns `true` if the profile.status is `SERVER_ERROR`', () => {
      const state = {
        user: {
          profile: {
            status: 'SERVER_ERROR',
          },
        },
      };
      expect(selectors.hasMPIConnectionError(state)).to.be.true;
    });
    it('returns `false` if the profile.status is anything other than `SERVER_ERROR`', () => {
      const state = {
        user: {
          profile: {
            status: 'ERROR',
          },
        },
      };
      expect(selectors.isInMPI(state)).to.be.false;
      delete state.user.profile;
      expect(selectors.isInMPI(state)).to.be.false;
    });
  });

  describe('selectCernerRxFacilities', () => {
    it('returns the Cerner facilities that are not in the RX blocklist', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              { facilityId: '983', isCerner: false }, // not cerner
              { facilityId: '757', isCerner: false }, // cerner, but blocked from RX
              { facilityId: '668', isCerner: true }, // cerner, not blocked from RX
            ],
            isCernerPatient: true,
          },
        },
      };
      const expected = [{ facilityId: '668', isCerner: true }];
      expect(selectors.selectCernerRxFacilities(state)).to.deep.equal(expected);
    });
  });

  describe('selectCernerMessagingFacilities', () => {
    it('returns the Cerner facilities that are not in the messaging blocklist', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              { facilityId: '983', isCerner: false }, // not cerner
              { facilityId: '757', isCerner: false }, // cerner, but blocked from messaging
              { facilityId: '668', isCerner: true }, // cerner, not blocked from messaging
            ],
            isCernerPatient: true,
          },
        },
      };
      const expected = [{ facilityId: '668', isCerner: true }];
      expect(selectors.selectCernerMessagingFacilities(state)).to.deep.equal(
        expected,
      );
    });
  });

  describe('selectCernerAppointmentsFacilities', () => {
    it('returns the Cerner facilities that are not in the appointments blocklist', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              { facilityId: '983', isCerner: false }, // not cerner
              { facilityId: '757', isCerner: false }, // cerner, not blocked from appointments
              { facilityId: '668', isCerner: true }, // cerner, not blocked from appointments
            ],
            isCernerPatient: true,
          },
        },
      };
      const expected = [
        { facilityId: '757', isCerner: true },
        { facilityId: '668', isCerner: true },
      ];
      expect(selectors.selectCernerAppointmentsFacilities(state)).to.deep.equal(
        expected,
      );
    });
  });

  describe('selectCernerMedicalRecordsFacilities', () => {
    it('returns the Cerner facilities that are not in the medical records blocklist', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              { facilityId: '983', isCerner: false }, // not cerner
              { facilityId: '757', isCerner: false }, // cerner, blocked from medical records
              { facilityId: '668', isCerner: true }, // cerner, not blocked from medical records
            ],
            isCernerPatient: true,
          },
        },
      };
      const expected = [{ facilityId: '668', isCerner: true }];
      expect(
        selectors.selectCernerMedicalRecordsFacilities(state),
      ).to.deep.equal(expected);
    });
  });

  describe('selectCernerTestResultsFacilities', () => {
    it('returns the Cerner facilities that are not in the test results blocklist', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              { facilityId: '983', isCerner: false }, // not cerner
              { facilityId: '757', isCerner: false }, // cerner, blocked from test results
              { facilityId: '668', isCerner: true }, // cerner, not blocked from test results
            ],
            isCernerPatient: true,
          },
        },
      };
      const expected = [{ facilityId: '668', isCerner: true }];
      expect(selectors.selectCernerTestResultsFacilities(state)).to.deep.equal(
        expected,
      );
    });
  });
});
