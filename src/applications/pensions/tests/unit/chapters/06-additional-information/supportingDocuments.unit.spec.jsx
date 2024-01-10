import { expect } from 'chai';
import { testNumberOfFields } from '../pageTests.spec';
import formConfig from '../../../../config/form';
import supportingDocuments, {
  childAttendsCollege,
  childIsDisabled,
} from '../../../../config/chapters/06-additional-information/supportingDocuments';

const { schema, uiSchema } = supportingDocuments;

describe('Supporting documents pension page', () => {
  const pageTitle = 'Supporting documents';
  const expectedNumberOfFields = 0;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  describe('childAttendsCollege', () => {
    it('should return true if child attends college', () => {
      expect(childAttendsCollege({ attendingCollege: true })).to.be.true;
    });
  });

  describe('childIsDisabled', () => {
    it('should return true if child is disabled', () => {
      expect(childIsDisabled({ disabled: true })).to.be.true;
    });
  });
});
