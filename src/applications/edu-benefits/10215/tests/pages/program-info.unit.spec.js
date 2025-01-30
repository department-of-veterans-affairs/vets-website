import { expect } from 'chai';
import { programInfo } from '../../pages';

describe('programInfo configuration', () => {
  describe('uiSchema', () => {
    it('should have the expected top-level fields', () => {
      const { uiSchema } = programInfo;

      expect(uiSchema).to.have.property('programName');
      expect(uiSchema).to.have.property('studentsEnrolled');
      expect(uiSchema).to.have.property('supportedStudents');
      expect(uiSchema).to.have.property('fte');
      expect(uiSchema).to.have.property('view:calcs');
    });

    it('should have a valid ui:description in uiSchema', () => {
      const description = programInfo.uiSchema['ui:description'];
      expect(description).to.be.a('object');
      expect(description.props).to.have.property('href');
      expect(description.props).to.have.property('text');
    });

    it('should require fte.supported and fte.nonSupported only when supportedStudents >= 10', () => {
      const { uiSchema } = programInfo;

      // For "supported"
      const supportedRequiredFn = uiSchema.fte.supported['ui:required'];
      expect(supportedRequiredFn).to.be.a('function');

      // For "nonSupported"
      const nonSupportedRequiredFn = uiSchema.fte.nonSupported['ui:required'];
      expect(nonSupportedRequiredFn).to.be.a('function');

      let formData = {
        programs: [{ supportedStudents: 15 }],
      };
      expect(supportedRequiredFn(formData, 0)).to.equal(true);
      expect(nonSupportedRequiredFn(formData, 0)).to.equal(true);

      // Scenario 2: supportedStudents is less than 10
      formData = {
        programs: [{ supportedStudents: 9 }],
      };
      expect(supportedRequiredFn(formData, 0)).to.equal(false);
      expect(nonSupportedRequiredFn(formData, 0)).to.equal(false);
    });
  });

  describe('schema', () => {
    it('should be an object schema with required fields', () => {
      const { schema } = programInfo;
      expect(schema).to.have.property('type', 'object');
      expect(schema).to.have.property('properties');
      expect(schema.properties).to.have.property('programName');
      expect(schema.properties).to.have.property('studentsEnrolled');
      expect(schema.properties).to.have.property('supportedStudents');
      expect(schema.properties).to.have.property('fte');
      expect(schema.properties).to.have.property('view:calcs');

      // required fields
      expect(schema)
        .to.have.property('required')
        .that.is.an('array');
      expect(schema.required).to.include.members([
        'programName',
        'studentsEnrolled',
        'supportedStudents',
      ]);
    });
  });
});
