import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';
import { NETWORTH_VALUE } from '../../config/constants';

const defaultDependents = [
  {
    fullName: {
      first: 'Jane',
      last: 'Doe',
    },
    dateOfBirth: '1990-07-07',
    ssn: '702023332',
    relationshipToVeteran: 'Spouse',
    awardIndicator: 'Y',
  },
  {
    fullName: {
      first: 'Mike',
      last: 'Doe',
    },
    dateOfBirth: '2005-08-08',
    ssn: '793473479',
    relationshipToVeteran: 'Child',
    awardIndicator: 'N',
  },
];

const buildData = ({
  ssnLastFour = '',
  vaFileLastFour = '',
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
      netWorthLimit,
      dependents,
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
      hasDependents:
        dependents.filter(d => d.awardIndicator === 'Y').length > 0,
      awarded: dependents.filter(d => d.awardIndicator === 'Y'),
      notAwarded: dependents.filter(d => d.awardIndicator !== 'Y'),
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
          ssnLastFour: '',
          vaFileLastFour: '',
        },
        veteranContactInformation: {
          veteranAddress: {
            isMilitary: false,
            country: 'USA',
            street: null,
            street2: null,
            street3: null,
            city: null,
            state: null,
            postalCode: null,
          },
          phoneNumber: null,
          emailAddress: null,
        },
        dependents: {
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
});
