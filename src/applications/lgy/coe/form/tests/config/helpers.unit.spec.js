import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';
import {
  customCOEsubmit,
  validateDocumentDescription,
} from '../../config/helpers';
import maximalTest from '../fixtures/data/maximal-test.json';
import maximalTestResult from '../fixtures/data/transformed-maximal-test.json';

describe('coe helpers', () => {
  describe('customCOEsubmit', () => {
    it('should correctly format the form data', () => {
      const submitting = JSON.parse(
        customCOEsubmit(formConfig, { data: maximalTest }),
      );
      expect(submitting).to.deep.equal(maximalTestResult);
    });
  });
  describe('validateDocumentDescription', () => {
    const errors = addError => [{ attachmentDescription: { addError } }];
    const fileList = (type, descrip) => [
      {
        attachmentType: type,
        attachmentDescription: descrip,
      },
    ];
    it('should not add an error for non-other type', () => {
      const spy = sinon.spy();
      validateDocumentDescription(errors(spy), fileList('ALTA statement', ''));
      expect(spy.called).to.be.false;
    });
    it('should not add an error for Other-type with description', () => {
      const spy = sinon.spy();
      validateDocumentDescription(errors(spy), fileList('Other', 'ok'));
      expect(spy.called).to.be.false;
    });
    it('should add an error for a missing attachmentDescription', () => {
      const spy = sinon.spy();
      validateDocumentDescription(errors(spy), fileList('Other', ''));
      expect(spy.called).to.be.true;
      expect(spy.calledWith('Please provide a description'));
    });
  });
});
