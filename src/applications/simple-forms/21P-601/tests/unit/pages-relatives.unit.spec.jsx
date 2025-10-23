import { expect } from 'chai';

import relativesOverview from '../../pages/relativesOverview';
import relativesDetails from '../../pages/relativesDetails';

describe('21P-601 relatives page configurations', () => {
  describe('relativesOverview', () => {
    it('exports uiSchema and schema', () => {
      expect(relativesOverview).to.have.property('uiSchema');
      expect(relativesOverview).to.have.property('schema');
    });

    it('has survivors field', () => {
      expect(relativesOverview.uiSchema).to.have.property('survivors');
      expect(relativesOverview.schema.properties).to.have.property('survivors');
    });

    it('has checkbox group schema for survivors', () => {
      expect(relativesOverview.schema.properties.survivors).to.exist;
    });

    it('has conditional message', () => {
      const { hideIf } = relativesOverview.uiSchema['view:noSurvivorsMessage'][
        'ui:options'
      ];
      expect(hideIf).to.be.a('function');
      expect(hideIf({ survivors: { hasNone: true } })).to.be.false;
      expect(hideIf({ survivors: { hasNone: false } })).to.be.true;
    });
  });

  describe('relativesDetails', () => {
    it('exports uiSchema and schema', () => {
      expect(relativesDetails).to.have.property('uiSchema');
      expect(relativesDetails).to.have.property('schema');
    });

    it('has survivingRelatives field', () => {
      expect(relativesDetails.uiSchema).to.have.property('survivingRelatives');
      expect(relativesDetails.schema.properties).to.have.property(
        'survivingRelatives',
      );
    });

    it('has viewField function', () => {
      const { viewField } = relativesDetails.uiSchema.survivingRelatives[
        'ui:options'
      ];
      expect(viewField).to.be.a('function');
      const result = viewField({
        formData: {
          fullName: { first: 'John', middle: 'A', last: 'Doe' },
          relationship: 'spouse',
          dateOfBirth: '1980-01-01',
        },
      });
      expect(result).to.exist;
    });

    it('viewField handles missing data', () => {
      const { viewField } = relativesDetails.uiSchema.survivingRelatives[
        'ui:options'
      ];
      const result = viewField({
        formData: {
          fullName: null,
          relationship: null,
        },
      });
      expect(result).to.exist;
    });

    it('viewField formats known relationships', () => {
      const { viewField } = relativesDetails.uiSchema.survivingRelatives[
        'ui:options'
      ];
      const result = viewField({
        formData: {
          fullName: { first: 'Jane' },
          relationship: 'child',
        },
      });
      expect(result).to.exist;
    });

    it('has updateSchema function', () => {
      const { updateSchema } = relativesDetails.uiSchema.survivingRelatives[
        'ui:options'
      ];
      expect(updateSchema).to.be.a('function');
      const schema = { minItems: 1 };
      const result = updateSchema({ hasNone: true }, schema);
      expect(result.minItems).to.equal(0);
    });
  });
});
