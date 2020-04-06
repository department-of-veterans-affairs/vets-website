import prefillTransformer, {
  filterServiceConnected,
  addNoneDisabilityActionType,
} from '../prefill-transformer';

import {
  SERVICE_CONNECTION_TYPES,
  disabilityActionTypes,
} from '../../all-claims/constants';

describe('526v2 prefill transformer', () => {
  const noTransformData = {
    metadata: { test: 'Test Metadata' },
    formData: {
      testData: `This isn't getting transformed`,
      'view:claimType': {
        'view:claimingIncrease': false,
        'view:claimingNew': true,
      },
    },
    pages: { testPage: 'Page 1' },
  };

  test('should return a copy of the prefill data', () => {
    const { pages, formData, metadata } = noTransformData;
    const noTransformActual = prefillTransformer(pages, formData, metadata);
    // ensure transformed data is not the same object as input data
    expect(noTransformActual).not.toBe(noTransformData);
    // ensure the transformed data properties are the same as input since no
    // changes expected given this input data set
    expect(noTransformActual).toEqual(noTransformData);
  });

  describe('prefillRatedDisabilities', () => {
    test('should filter out non-service-connected disabilities', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        disabilities: [
          {
            name: 'diabetes melitus',
            decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected,
          },
          {
            name: 'other disability',
            decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected,
          },
        ],
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      expect(Array.isArray(transformedData.ratedDisabilities)).toBe(true)
        .toHaveLength(1);
      expect(transformedData.ratedDisabilities[0].name).toBe(
        formData.disabilities[0].name,
      );
    });

    test(
      'should add claimType when no rated service-connected disabilities',
      () => {
        const { pages, metadata } = noTransformData;
        const formData = {
          disabilities: [
            {
              name: 'other disability',
              decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected,
            },
          ],
        };

        const transformedData = prefillTransformer(pages, formData, metadata)
          .formData;
        expect(transformedData['view:claimType']).toEqual(
          noTransformData.formData['view:claimType'],
        );
      }
    );

    test('should add claimType when no disabilities', () => {
      const { pages, metadata } = noTransformData;
      const formData = {};

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      expect(transformedData).toEqual({
        'view:claimType': noTransformData.formData['view:claimType'],
      });
    });

    test(
      'should not add claimType when service-connected disabilities present',
      () => {
        const { pages, metadata } = noTransformData;
        const formData = {
          disabilities: [
            {
              name: 'other disability',
              decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected,
            },
          ],
        };

        const transformedData = prefillTransformer(pages, formData, metadata)
          .formData;
        expect(transformedData.ratedDisabilities[0].name).toBe(
          formData.disabilities[0].name,
        );
      }
    );
  });

  describe('prefillContactInformation', () => {
    test('should transform contact info when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        veteran: {
          primaryPhone: '1123123123',
          emailAddress: 'a@b.c',
          mailingAddress: {
            addressLine1: '123 Any Street',
            city: 'Anyville',
            state: 'AK',
            zipCode: '12345',
          },
        },
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;

      const { primaryPhone, emailAddress, mailingAddress } = formData.veteran;
      expect(transformedData).toEqual({
        'view:claimType': noTransformData.formData['view:claimType'],
        phoneAndEmail: {
          primaryPhone,
          emailAddress,
        },
        mailingAddress,
      });
    });

    test('should transform partial contact info', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        veteran: {
          emailAddress: 'a@b.c',
        },
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;

      expect(transformedData).toEqual({
        'view:claimType': noTransformData.formData['view:claimType'],
        phoneAndEmail: {
          emailAddress: formData.veteran.emailAddress,
        },
      });
    });
  });

  describe('prefillServiceInformation', () => {
    test('should transform service info when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        servicePeriods: [
          {
            serviceBranch: 'army',
            dateRange: { from: '2010-01-01', to: '2015-10-10' },
          },
        ],
        reservesNationalGuardService: {
          obligationTermOfServiceDateRange: {
            from: '2016-01-01',
            to: '2018-01-01',
          },
        },
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      const { servicePeriods, reservesNationalGuardService } = formData;
      expect(transformedData).toEqual({
        'view:claimType': noTransformData.formData['view:claimType'],
        serviceInformation: {
          servicePeriods,
          reservesNationalGuardService,
        },
      });
    });

    test('should transform partial service info when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        servicePeriods: [
          {
            serviceBranch: 'army',
            dateRange: { from: '2010-01-01', to: '2015-10-10' },
          },
        ],
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      const { servicePeriods } = formData;
      expect(transformedData).toEqual({
        'view:claimType': noTransformData.formData['view:claimType'],
        serviceInformation: { servicePeriods },
      });
    });
  });

  describe('prefillBankInformation', () => {
    test('should transform bank info when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        bankAccountType: 'Checking',
        bankAccountNumber: '123123123',
        bankRoutingNumber: '234234234',
        bankName: 'Bank Of Test',
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      const {
        bankAccountType,
        bankAccountNumber,
        bankRoutingNumber,
        bankName,
      } = formData;
      expect(transformedData).toEqual({
        'view:claimType': noTransformData.formData['view:claimType'],
        'view:originalBankAccount': {
          'view:bankAccountType': bankAccountType,
          'view:bankAccountNumber': bankAccountNumber,
          'view:bankRoutingNumber': bankRoutingNumber,
          'view:bankName': bankName,
        },
        'view:bankAccount': { 'view:hasPrefilledBank': true },
      });
    });
    test('should not prefill any bank info when some info not present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        bankAccountType: 'Checking',
        bankAccountNumber: '123123123',
        bankRoutingNumber: '234234234',
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;

      expect(transformedData).toEqual({
        'view:claimType': noTransformData.formData['view:claimType'],
      });
    });
  });
});

describe('addNoneDisabilityActionType', () => {
  const disabilities = [
    { decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected },
    { decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected },
    { decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected },
    { decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected },
  ];

  test('should return an array of same length as input', () => {
    const withActionType = addNoneDisabilityActionType(disabilities);
    expect(Array.isArray(withActionType)).toBe(true)
      .toHaveLength(disabilities.length);
  });

  test('should return an empty array when no input', () => {
    expect(Array.isArray(addNoneDisabilityActionType())).toBe(true)
      .toHaveLength(0);
  });

  test(
    'should set disabilityActionType to NONE for each rated disability',
    () => {
      const withActionType = addNoneDisabilityActionType(disabilities);
      withActionType.forEach(d => {
        expect(d.disabilityActionType).toBe(disabilityActionTypes.NONE);
      });
    }
  );
});

describe('filterServiceConnected', () => {
  test('should filter non-service-connected disabililties', () => {
    const disabilities = [
      { decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected },
      { decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected },
      { decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected },
      { decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected },
    ];

    const filteredDisabilities = filterServiceConnected(disabilities);
    expect(filteredDisabilities.length).toBe(2);
    filteredDisabilities.forEach(d =>
      expect(d.decisionCode).toBe(SERVICE_CONNECTION_TYPES.serviceConnected),
    );
  });

  test('should return an empty array when no disabilities provided', () => {
    const disabilities = [];

    const filteredDisabilities = filterServiceConnected(disabilities);
    expect(filteredDisabilities).toEqual([]);
  });
});
