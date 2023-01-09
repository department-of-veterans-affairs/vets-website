export const claimantInfo = {
  data: {
    formData: {
      data: {
        attributes: {
          claimant: {
            claimantId: '1000000000000246',
            suffix: '',
            dateOfBirth: '1970-01-01',
            firstName: 'Herbert',
            lastName: 'Hoover',
            middleName: '',
            contactInfo: {
              addressLine1: '123 Martin Luther King Blvd',
              addressLine2: '',
              city: 'New Orleans',
              zipcode: '70115',
              effectiveDate: '',
              zipCodeExtension: '',
              emailAddress: 'test@test.com',
              addressType: 'MILITARY_OVERSEAS',
              mobilePhoneNumber: '512-825-5445',
              homePhoneNumber: '222-333-3333',
              countryCode: 'US',
              stateCode: 'ME',
            },
            dobChanged: false,
            firstAndLastNameChanged: false,
            contactInfoChanged: false,
            notificationMethod: 'EMAIL',
            preferredContact: 'mail',
          },
          serviceData: [
            {
              beginDate: '2010-10-26T18:00:54.302Z',
              endDate: '2021-10-26T18:00:54.302Z',
              branchOfService: 'Army',
              trainingPeriods: [
                {
                  beginDate: '2018-10-26T18:00:54.302Z',
                  endDate: '2019-10-26T18:00:54.302Z',
                },
              ],
              exclusionPeriods: [
                {
                  beginDate: '2012-10-26T18:00:54.302Z',
                  endDate: '2013-10-26T18:00:54.302Z',
                },
              ],
              characterOfService: 'Honorable',
              reasonForSeparation: 'Expiration Term Of Service',
            },
          ],
        },
      },
    },
  },
};
