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
    it('returns undefined if there is not vet360 on the profile', () => {
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
});
