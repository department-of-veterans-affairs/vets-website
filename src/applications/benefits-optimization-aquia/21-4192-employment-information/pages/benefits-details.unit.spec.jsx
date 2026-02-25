/**
 * @module tests/pages/benefits-details.unit.spec
 * @description Unit tests for Benefits Details page dynamic title logic
 * VA Form 21-4192 - Request for Employment Information
 */

import { expect } from 'chai';
import React from 'react';

import { benefitsDetailsUiSchema } from './benefits-details';

describe('Benefits Details Page', () => {
  describe('updateUiSchema dynamic titles', () => {
    const { updateUiSchema } = benefitsDetailsUiSchema['ui:options'];

    it('should include veteran name in field titles with masking', () => {
      const formData = {
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };

      const result = updateUiSchema(formData, formData);
      const title = result.benefitsDetails.stopReceivingDate['ui:title'];

      // Title should be a JSX element with masking
      expect(React.isValidElement(title)).to.be.true;
      expect(title.props['data-dd-privacy']).to.equal('mask');
      expect(title.props.children).to.include('John Doe');
    });

    it('should fall back to Veteran when name is missing', () => {
      const result = updateUiSchema({}, {});
      const title = result.benefitsDetails.stopReceivingDate['ui:title'];

      // Should be a plain string when using fallback
      expect(title).to.be.a('string');
      expect(title).to.include('Veteran');
    });
  });
});
