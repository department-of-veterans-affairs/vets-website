import { expect } from 'chai';

import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submit-transformer';
import fixtureVet from '../../e2e/fixtures/data/veteran.json';
import fixtureNonVet from '../../e2e/fixtures/data/nonVeteran.json';
// import fixture3rdPtyVet from '../../e2e/fixtures/data/thirdPartyVeteran.json';
// import fixture3rdPtyNonVet from '../../e2e/fixtures/data/thirdPartyNonVeteran.json';

formConfig.chapters.preparerTypeChapter.pages.preparerTypePage.initialData = undefined;

describe('transformForSubmit', () => {
  describe('name-fields truncation for PDF', () => {
    const fullNameLong = {
      first: 'AbcdefghijklZZZ',
      middle: 'AZZZ',
      last: 'AbcdefghijklmnopqrZZZ',
    };
    const fullNameTruncated = {
      first: 'Abcdefghijkl',
      middle: 'A',
      last: 'Abcdefghijklmnopqr',
    };

    it('truncates veteran name-fields', () => {
      const data = {
        data: {
          ...fixtureVet.data,
          veteranFullName: fullNameLong,
        },
      };
      const transformedData = {
        ...fixtureVet.data,
        veteranFullName: fullNameTruncated,
        formNumber: '20-10207',
      };

      const transformedResult = JSON.parse(
        transformForSubmit(formConfig, data),
      );
      expect(transformedResult).to.deep.equal(transformedData);
    });

    it('truncates non-veteran name-fields', () => {
      const data = {
        data: {
          ...fixtureNonVet.data,
          nonVeteranFullName: fullNameLong,
        },
      };
      const transformedData = {
        ...fixtureNonVet.data,
        nonVeteranFullName: fullNameTruncated,
        formNumber: '20-10207',
      };

      const transformedResult = JSON.parse(
        transformForSubmit(formConfig, data),
      );
      expect(transformedResult).to.deep.equal(transformedData);
    });
  });

  describe('address-fields truncation for PDF', () => {
    const addressLong = {
      street: '12345 South International Ave ZZZ',
      street2: '12345ZZZ',
      city: 'South San Francisco ZZZ',
      country: 'USA',
      state: 'NY',
      postalCode: '12345',
    };
    const addressTruncated = {
      street: '12345 South International Ave ',
      street2: '12345',
      city: 'South San Francisco ',
      country: 'USA',
      state: 'NY',
      postalCode: '12345',
    };

    it('truncates veteran address-fields', () => {
      const data = {
        data: {
          ...fixtureVet.data,
          veteranMailingAddress: addressLong,
        },
      };
      const transformedData = {
        ...fixtureVet.data,
        veteranMailingAddress: addressTruncated,
        formNumber: '20-10207',
      };

      const transformedResult = JSON.parse(
        transformForSubmit(formConfig, data),
      );
      expect(transformedResult).to.deep.equal(transformedData);
    });

    it('truncates non-veteran address-fields', () => {
      const data = {
        data: {
          ...fixtureNonVet.data,
          nonVeteranMailingAddress: addressLong,
        },
      };
      const transformedData = {
        ...fixtureNonVet.data,
        nonVeteranMailingAddress: addressTruncated,
        formNumber: '20-10207',
      };

      const transformedResult = JSON.parse(
        transformForSubmit(formConfig, data),
      );
      expect(transformedResult).to.deep.equal(transformedData);
    });
  });

  describe('unneeded other-reasons evidence removal', () => {
    const unneededEvidence = {
      alsDocuments: [
        {
          name: '[mock_filename]',
          size: 493235,
          isEncrypted: false,
        },
      ],
      financialHardshipDocuments: [
        {
          name: '[mock_filename]',
          size: 493235,
          isEncrypted: false,
        },
      ],
      medalAwardDocuments: [
        {
          name: '[mock_filename]',
          size: 493235,
          isEncrypted: false,
        },
      ],
      powConfinementStartDate: '2013-01-01',
      powConfinementEndDate: '2013-01-02',
      powMultipleConfinements: true,
      powConfinement2StartDate: '2013-01-03',
      powConfinement2EndDate: '2013-01-04',
      terminalIllnessDocuments: [
        {
          name: '[mock_filename]',
          size: 493235,
          isEncrypted: false,
        },
      ],
      vsiDocuments: [
        {
          name: '[mock_filename]',
          size: 493235,
          isEncrypted: false,
        },
      ],
    };

    it('removes unneeded evidence data', () => {
      const data = {
        data: {
          ...fixtureVet.data,
          ...unneededEvidence,
        },
      };
      const transformedData = {
        ...fixtureVet.data,
        formNumber: '20-10207',
      };

      const transformedResult = JSON.parse(
        transformForSubmit(formConfig, data),
      );
      expect(transformedResult).to.deep.equal(transformedData);
    });
  });
});
