import { expect } from 'chai';
import {
  schema,
  uiSchema,
} from '../../../config/chapters/status-selection/status';
import { status as statusSchema } from '../../../config/utilities';

describe('schema', () => {
  it('should define the correct type', () => {
    expect(schema.type).to.equal('object');
  });

  it('should define properties correctly', () => {
    expect(schema.properties).to.have.property('status');
  });
});

describe('uiSchema', () => {
  describe('status', () => {
    it('should have the correct title', () => {
      expect(uiSchema.status['ui:title']).to.equal(
        'Let us know which of these best describes you:',
      );
    });

    it('should use the correct widget', () => {
      expect(uiSchema.status['ui:widget']).to.equal('radio');
    });

    it('should always be required', () => {
      const requiredResult = uiSchema.status['ui:required']();
      expect(requiredResult).to.be.true;
    });

    describe('updateSchema', () => {
      it('should return the correct schema based on statusSchema', () => {
        const result = uiSchema.status['ui:options'].updateSchema(
          {},
          statusSchema,
        );

        expect(result.type).to.equal('string');
        expect(result.enum).to.eql(statusSchema.enum);
        expect(result.enumNames).to.eql([
          'I’m an active-duty service member',
          'I’m a Veteran',
          'I’m a dependent spouse',
          'I’m a dependent child',
        ]);
      });
    });
  });
});
