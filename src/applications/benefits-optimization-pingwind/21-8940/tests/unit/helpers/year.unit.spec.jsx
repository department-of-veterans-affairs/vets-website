import { expect } from 'chai';
import sinon from 'sinon';
import { yearSchema, yearUI } from '../../../helpers/year';

describe('21-8940 year helpers', () => {
  it('builds a uiSchema with hint and options', () => {
    const result = yearUI({
      title: 'Employment year',
      hint: 'Use four digits',
      foo: 'bar',
    });

    expect(result['ui:title']).to.equal('Employment year');
    expect(result['ui:options'].hint).to.equal('Use four digits');
    expect(result['ui:options'].foo).to.equal('bar');
    expect(result['ui:options'].widgetClassNames).to.equal('usa-input-medium');
    expect(result['ui:validations']).to.have.lengthOf(2);
  });

  it('accepts a string for the title', () => {
    const result = yearUI('Service year');
    expect(result['ui:title']).to.equal('Service year');
  });

  it('validates min year', () => {
    const result = yearUI('Year');
    const [, validateMinYear] = result['ui:validations'];
    const errors = { addError: sinon.spy() };

    validateMinYear(errors, '1899');
    expect(errors.addError.calledOnce).to.be.true;
  });

  it('allows 1900 and later', () => {
    const result = yearUI('Year');
    const [, validateMinYear] = result['ui:validations'];
    const errors = { addError: sinon.spy() };

    validateMinYear(errors, '1900');
    expect(errors.addError.called).to.be.false;
  });

  it('exports a four-digit year schema', () => {
    expect(yearSchema.type).to.equal('string');
    expect(yearSchema.pattern).to.equal('^\\d{4}$');
  });
});
