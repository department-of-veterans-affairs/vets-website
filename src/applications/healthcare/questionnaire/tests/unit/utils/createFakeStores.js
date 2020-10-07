const createFakeUserStore = (
  gender = 'M',
  useMailingAddress = true,
  useResidentialAddress = true,
  phones = {
    hasMobile: true,
    hasHome: true,
    hasWork: true,
    hasTemporary: true,
  },
) => {
  return {
    getState: () => ({
      user: {
        profile: {
          userFullName: {
            first: 'CALVIN',
            middle: 'C',
            last: 'FLETCHER',
          },
          dob: '1924-12-19',
          gender,
          vet360: {
            mobilePhone: phones.hasMobile
              ? {
                  areaCode: '503',
                  countryCode: '1',
                  createdAt: '2018-04-21T20:09:50Z',
                  effectiveEndDate: '2018-04-21T20:09:50Z',
                  effectiveStartDate: '2018-04-21T20:09:50Z',
                  extension: '0000',
                  id: 123,
                  isInternational: false,
                  isTextable: true,
                  isTextPermitted: null,
                  isTty: true,
                  isVoicemailable: true,
                  phoneNumber: '5551234',
                  phoneType: 'MOBILE',
                  sourceDate: '2018-04-21T20:09:50Z',
                  updatedAt: '2018-04-21T20:09:50Z',
                }
              : null,
            homePhone: phones.hasHome
              ? {
                  areaCode: '503',
                  countryCode: '1',
                  createdAt: '2018-04-21T20:09:50Z',
                  effectiveEndDate: '2018-04-21T20:09:50Z',
                  effectiveStartDate: '2018-04-21T20:09:50Z',
                  extension: '0000',
                  id: 123,
                  isInternational: false,
                  isTextable: false,
                  isTextPermitted: false,
                  isTty: true,
                  isVoicemailable: true,
                  phoneNumber: '2222222',
                  phoneType: 'HOME',
                  sourceDate: '2018-04-21T20:09:50Z',
                  updatedAt: '2018-04-21T20:09:50Z',
                }
              : null,
            workPhone: phones.hasWork
              ? {
                  areaCode: '555',
                  countryCode: '1',
                  createdAt: '2018-04-21T20:09:50Z',
                  effectiveEndDate: '2018-04-21T20:09:50Z',
                  effectiveStartDate: '2018-04-21T20:09:50Z',
                  extension: '0000',
                  id: 123,
                  isInternational: false,
                  isTextable: false,
                  isTextPermitted: false,
                  isTty: true,
                  isVoicemailable: true,
                  phoneNumber: '8675309',
                  phoneType: 'WORK',
                  sourceDate: '2018-04-21T20:09:50Z',
                  updatedAt: '2018-04-21T20:09:50Z',
                }
              : null,
            faxNumber: null,
            temporaryPhone: phones.hasTemporary
              ? {
                  areaCode: '503',
                  countryCode: '1',
                  createdAt: '2018-04-21T20:09:50Z',
                  effectiveEndDate: '2018-04-21T20:09:50Z',
                  effectiveStartDate: '2018-04-21T20:09:50Z',
                  extension: '0000',
                  id: 123,
                  isInternational: false,
                  isTextable: false,
                  isTextPermitted: false,
                  isTty: true,
                  isVoicemailable: true,
                  phoneNumber: '5555555',
                  phoneType: 'MOBILE',
                  sourceDate: '2018-04-21T20:09:50Z',
                  updatedAt: '2018-04-21T20:09:50Z',
                }
              : null,
            mailingAddress: useMailingAddress
              ? {
                  addressLine1: '1493 Martin Luther King Rd',
                  addressLine2: 'Apt 1',
                  addressLine3: null,
                  addressPou: 'CORRESPONDENCE',
                  addressType: 'DOMESTIC',
                  city: 'Fulton',
                  countryName: 'United States',
                  countryCodeFips: 'US',
                  countryCodeIso2: 'US',
                  countryCodeIso3: 'USA',
                  createdAt: '2018-04-21T20:09:50Z',
                  effectiveEndDate: '2018-04-21T20:09:50Z',
                  effectiveStartDate: '2018-04-21T20:09:50Z',
                  id: 123,
                  internationalPostalCode: '54321',
                  province: 'string',
                  sourceDate: '2018-04-21T20:09:50Z',
                  stateCode: 'NY',
                  updatedAt: '2018-04-21T20:09:50Z',
                  zipCode: '97062',
                  zipCodeSuffix: '1234',
                }
              : null,
            residentialAddress: useResidentialAddress
              ? {
                  addressLine1: 'PSC 808 Box 37',
                  addressLine2: null,
                  addressLine3: null,
                  addressPou: 'RESIDENCE/CHOICE',
                  addressType: 'OVERSEAS MILITARY',
                  city: 'FPO',
                  countryName: 'United States',
                  countryCodeFips: 'US',
                  countryCodeIso2: 'US',
                  countryCodeIso3: 'USA',
                  createdAt: '2018-04-21T20:09:50Z',
                  effectiveEndDate: '2018-04-21T20:09:50Z',
                  effectiveStartDate: '2018-04-21T20:09:50Z',
                  id: 124,
                  internationalPostalCode: '54321',
                  province: 'string',
                  sourceDate: '2018-04-21T20:09:50Z',
                  stateCode: 'AE',
                  updatedAt: '2018-04-21T20:09:50Z',
                  zipCode: '09618',
                  zipCodeSuffix: '1234',
                }
              : null,
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
};

const createFakeChiefComplaintStore = () => {
  return {
    getState: () => ({}),
    subscribe: () => {},
    dispatch: () => {},
  };
};

const createFakeReasonForVisitStore = ({ reason = '' }) => {
  return {
    getState: () => ({
      clipboardAppointmentDetails: {
        reasonForVisit: reason,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
};

const createFakeConfirmationStore = ({ hasData }) => {
  return {
    getState: () => {
      return hasData
        ? {
            form: {
              submission: {
                response: {
                  veteranInfo: { fullName: 'Mickey Mouse' },
                  timestamp: new Date(),
                },
              },
            },
            questionnaireData: {
              context: {
                appointment: {
                  vdsAppointments: [
                    { clinic: { facility: { displayName: 'Magic Kingdom' } } },
                  ],
                },
              },
            },
          }
        : { form: {}, questionnaireData: {} };
    },
    subscribe: () => {},
    dispatch: () => {},
  };
};

export {
  createFakeUserStore,
  createFakeChiefComplaintStore,
  createFakeReasonForVisitStore,
  createFakeConfirmationStore,
};
