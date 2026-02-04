import { expect } from 'chai';

import prefillTransformer from '../../config/prefill-transformer';
import { NETWORTH_VALUE } from '../../config/constants';

import { createDoB } from '../test-helpers';

const defaultDependents = [
  {
    fullName: {
      first: 'Jane',
      last: 'Doe',
    },
    dateOfBirth: createDoB(35),
    ssn: '702023332',
    relationshipToVeteran: 'Spouse',
    awardIndicator: 'Y',
  },
  {
    fullName: {
      first: 'Mike',
      last: 'Doe',
    },
    dateOfBirth: createDoB(18),
    ssn: '793473479',
    relationshipToVeteran: 'Child',
    awardIndicator: 'N',
  },
];

const processedDependents = {
  '702023332': {
    key: 'jane-3332',
    age: 35,
    labeledAge: '35 years old',
  },
  '793473479': {
    key: 'mike-3479',
    age: 18,
    labeledAge: '18 years old',
  },
};

const buildData = ({
  ssnLastFour = '',
  vaFileLastFour = '',
  isInReceiptOfPension = -1,
  city = 'Decatur',
  useV2 = true,
  daysTillExpires = 365,
  netWorthLimit = NETWORTH_VALUE,
  dependents = defaultDependents,
}) => ({
  prefill: {
    data: {},
    nonPrefill: {
      veteranSsnLastFour: ssnLastFour,
      veteranVaFileNumberLastFour: vaFileLastFour,
      isInReceiptOfPension,
      netWorthLimit,
      dependents: {
        success: 'true',
        dependents,
      },
    },
    veteranContactInformation: {
      veteranAddress: {
        countryName: 'USA',
        addressLine1: '1700 Clairmont Rd',
        addressLine2: 'Suite 100',
        addressLine3: 'c/o Joe Smith',
        city,
        stateCode: 'GA',
        zipCode: '30033',
      },
      phoneNumber: '2023336688',
      emailAddress: 'vets.gov.user80@gmail.com',
    },
  },
  result: {
    useV2,
    daysTillExpires,
    netWorthLimit,
    veteranInformation: {
      ssnLastFour,
      vaFileLastFour,
      isInReceiptOfPension,
    },
    veteranContactInformation: {
      veteranAddress: {
        isMilitary: city === 'APO',
        country: 'USA',
        street: '1700 Clairmont Rd',
        street2: 'Suite 100',
        street3: 'c/o Joe Smith',
        city,
        state: 'GA',
        postalCode: '30033',
      },
      phoneNumber: '2023336688',
      emailAddress: 'vets.gov.user80@gmail.com',
    },
    dependents: {
      hasError: false,
      hasDependents:
        dependents.filter(d => d.awardIndicator === 'Y').length > 0,
      awarded: dependents.filter(d => d.awardIndicator === 'Y').map(d => ({
        ...d,
        ...processedDependents[d.ssn],
      })),
      notAwarded: dependents.filter(d => d.awardIndicator !== 'Y').map(d => ({
        ...d,
        ...processedDependents[d.ssn],
      })),
    },
  },
});

describe('686c-674 v2 prefill transformer', () => {
  const noTransformData = {
    metadata: { test: 'Test Metadata' },
    formData: {
      testData: 'This is not getting transformed',
      data: {},
    },
    pages: { testPage: 'Page 1' },
  };

  it('should return built out template from prefill data', () => {
    const { pages, formData, metadata } = noTransformData;
    const noTransformActual = prefillTransformer(pages, formData, metadata);
    expect(noTransformActual).to.not.equal(noTransformData);
    expect(noTransformActual).to.deep.equal({
      metadata: noTransformData.metadata,
      formData: {
        useV2: true,
        daysTillExpires: 365,
        netWorthLimit: NETWORTH_VALUE,
        veteranInformation: {
          isInReceiptOfPension: -1,
          ssnLastFour: '',
          vaFileLastFour: '',
        },
        veteranContactInformation: {
          veteranAddress: {
            isMilitary: false,
            country: 'USA',
            street: '',
            street2: '',
            street3: '',
            city: '',
            state: '',
            postalCode: '',
          },
          phoneNumber: null,
          emailAddress: null,
        },
        dependents: {
          hasError: false,
          hasDependents: false,
          awarded: [],
          notAwarded: [],
        },
      },
      pages: noTransformData.pages,
    });
  });

  describe('prefill veteran information & contact information', () => {
    it('should transform contact info when present', () => {
      const { pages, metadata } = noTransformData;
      const data = buildData({
        ssnLastFour: '9876',
        vaFileLastFour: '7654',
        isInReceiptOfPension: 1,
      });
      const transformedData = prefillTransformer(pages, data.prefill, metadata)
        .formData;

      expect(transformedData).to.deep.equal(data.result);
    });
  });

  describe('prefill contact info with military address', () => {
    it('should transform contact info when present', () => {
      const { pages, metadata } = noTransformData;
      const data = buildData({
        ssnLastFour: '9876',
        vaFileLastFour: '7654',
        city: 'APO',
      });
      const transformedData = prefillTransformer(pages, data.prefill, metadata)
        .formData;

      expect(transformedData).to.deep.equal(data.result);
    });
  });

  describe('prefill with netWorthValue', () => {
    it('should use netWorthValue when present', () => {
      const { pages, metadata } = noTransformData;
      const data = buildData({
        ssnLastFour: '9876',
        vaFileLastFour: '7654',
        city: 'APO',
        netWorthLimit: '200,000',
      });
      const transformedData = prefillTransformer(pages, data.prefill, metadata)
        .formData;

      expect(transformedData).to.deep.equal(data.result);
    });
    it('should use default value for netWorthValue when absent', () => {
      const { pages, metadata } = noTransformData;
      const data = buildData({
        ssnLastFour: '9876',
        vaFileLastFour: '7654',
        city: 'APO',
      });
      const transformedData = prefillTransformer(pages, data.prefill, metadata)
        .formData;

      expect(transformedData).to.deep.equal(data.result);
      expect(transformedData.netWorthLimit).to.equal(NETWORTH_VALUE);
    });
  });

  describe('prefill isInReceiptOfPension values', () => {
    it('should default to -1 when not provided', () => {
      const { pages, metadata } = noTransformData;
      const data = buildData({});
      const transformedData = prefillTransformer(pages, data.prefill, metadata)
        .formData;

      expect(transformedData.veteranInformation.isInReceiptOfPension).to.equal(
        -1,
      );
    });

    it('should transform isInReceiptOfPension: 0 (not in receipt of pension)', () => {
      const { pages, metadata } = noTransformData;
      const data = buildData({
        isInReceiptOfPension: 0,
      });
      const transformedData = prefillTransformer(pages, data.prefill, metadata)
        .formData;

      expect(transformedData.veteranInformation.isInReceiptOfPension).to.equal(
        0,
      );
    });

    it('should transform isInReceiptOfPension: 1 (in receipt of pension)', () => {
      const { pages, metadata } = noTransformData;
      const data = buildData({
        isInReceiptOfPension: 1,
      });
      const transformedData = prefillTransformer(pages, data.prefill, metadata)
        .formData;

      expect(transformedData.veteranInformation.isInReceiptOfPension).to.equal(
        1,
      );
    });
  });

  describe('preserve user edits when loading saved in-progress data', () => {
    it('should preserve user-edited address when metadata has returnUrl', () => {
      const { pages } = noTransformData;
      const metadataWithReturnUrl = {
        returnUrl: '/veteran-address',
        savedAt: 1234567890,
      };

      // Simulate saved in-progress data where user edited the address
      const savedFormData = {
        veteranContactInformation: {
          veteranAddress: {
            country: 'PHL',
            street: '123 Edited Street',
            street2: 'Unit 5',
            street3: '',
            city: 'Manila',
            state: 'Metro Manila',
            postalCode: 'NA',
          },
          phoneNumber: '5555555555',
          emailAddress: 'user@example.com',
        },
        nonPrefill: {
          veteranSsnLastFour: '1234',
          veteranVaFileNumberLastFour: '5678',
          isInReceiptOfPension: 0,
          netWorthLimit: NETWORTH_VALUE,
          dependents: {
            success: 'true',
            dependents: [],
          },
        },
      };

      const transformedData = prefillTransformer(
        pages,
        savedFormData,
        metadataWithReturnUrl,
      ).formData;

      // Verify the user's edited address is preserved
      expect(
        transformedData.veteranContactInformation.veteranAddress,
      ).to.deep.equal({
        isMilitary: false,
        country: 'PHL',
        street: '123 Edited Street',
        street2: 'Unit 5',
        street3: '',
        city: 'Manila',
        state: 'Metro Manila',
        postalCode: 'NA',
      });
    });

    it('should apply prefill transformation when metadata has no returnUrl', () => {
      const { pages, metadata } = noTransformData;
      const data = buildData({
        ssnLastFour: '9876',
        vaFileLastFour: '7654',
      });

      const transformedData = prefillTransformer(pages, data.prefill, metadata)
        .formData;

      // Verify prefill transformation is applied (addressLine1 -> street, etc.)
      expect(
        transformedData.veteranContactInformation.veteranAddress,
      ).to.deep.equal({
        isMilitary: false,
        country: 'USA',
        street: '1700 Clairmont Rd',
        street2: 'Suite 100',
        street3: 'c/o Joe Smith',
        city: 'Decatur',
        state: 'GA',
        postalCode: '30033',
      });
    });
  });
});
