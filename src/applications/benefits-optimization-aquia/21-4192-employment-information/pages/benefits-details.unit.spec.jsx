/**
 * @module tests/pages/benefits-details.unit.spec
 * @description Unit tests for Benefits Details page dynamic title logic
 * VA Form 21-4192 - Request for Employment Information
 */

import { expect } from 'chai';

import { benefitsDetailsUiSchema } from './benefits-details';

describe('Benefits Details Page', () => {
  describe('updateUiSchema dynamic titles', () => {
    const { updateUiSchema } = benefitsDetailsUiSchema['ui:options'];

    it('should include veteran name in field titles', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };

      const result = updateUiSchema(formData, formData);

      expect(result.benefitsDetails.stopReceivingDate['ui:title']).to.include(
        'John Doe',
      );
    });

    it('should fall back to Veteran when name is missing', () => {
      const result = updateUiSchema({}, {});

      expect(result.benefitsDetails.stopReceivingDate['ui:title']).to.include(
        'Veteran',
      );
    });
  });
});
