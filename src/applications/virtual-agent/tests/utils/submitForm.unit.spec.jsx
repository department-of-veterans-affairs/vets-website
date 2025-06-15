import sinon from 'sinon';
import { expect } from 'chai';
import submitForm, { createForm } from '../../utils/submitForm';

const method = 'post';
const action = 'https://test.com/';
const target = '_blank';

const params = {
  field1: 'value1',
  field2: 'value2',
};

describe('createForm', () => {
  it('should create a form with the correct method, action, and target', () => {
    const form = createForm(action, {}, method);

    expect(form.method).to.equal(method);
    expect(form.action).to.equal(action);
    expect(form.target).to.equal(target);
  });

  it('should create hidden fields with the correct names and values', () => {
    const form = createForm(action, params, method);

    const formHiddenFields = Array.from(form.querySelectorAll('input'));

    expect(formHiddenFields.length).to.equal(Object.keys(params).length);

    formHiddenFields.forEach(hiddenField => {
      const fieldName = hiddenField.name;
      const fieldValue = hiddenField.value;

      expect(fieldName).to.be.oneOf(Object.keys(params));
      expect(fieldValue).to.equal(params[fieldName]);
      expect(hiddenField.type).to.equal('hidden');
    });
  });
});

describe('submitForm', () => {
  it('Should submit form with the correct method, action, and target', () => {
    const removeSpy = sinon.spy();
    const submitSpy = sinon.spy();
    sinon.stub(document, 'createElement').returns({
      remove: removeSpy,
      submit: submitSpy,
    });
    const appendStub = sinon.stub(document.body, 'appendChild');

    submitForm(action, {});

    expect(appendStub.calledOnce).to.be.true;
    expect(submitSpy.calledOnce).to.be.true;
    expect(removeSpy.calledOnce).to.be.true;
  });
});
