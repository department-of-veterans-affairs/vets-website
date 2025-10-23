import { expect } from 'chai';

import { currencyUI } from '../../../src/js/web-component-patterns';

describe('currencyUI', () => {
  it('should return a uiSchema with default properties', () => {
    const uiSchema = currencyUI('Test Title');
    const uiErrors = uiSchema['ui:errorMessages'];

    expect(uiSchema['ui:title']).to.equal('Test Title');
    expect(uiSchema['ui:description']).to.be.undefined;
    expect(uiSchema['ui:hint']).to.be.undefined;
    expect(uiSchema['ui:validations'].length).to.equal(1);
    expect(uiErrors.pattern).to.equal('Enter a valid dollar amount');
    expect(uiErrors.type).to.equal('Enter a valid dollar amount');
    expect(uiErrors.min).to.equal('Enter a number greater than or equal to 0');
    expect(uiErrors.max).to.equal(
      'Enter a number less than or equal to 999999999',
    );
  });

  it('should return a uiSchema with the correct properties', () => {
    const options = {
      title: 'Test Title',
      description: 'Test Description',
      hint: 'Test Hint',
      width: 'lg',
      currencySymbol: '$',
      min: 12,
      max: 34,
    };
    const uiSchema = currencyUI(options);
    const uiOptions = uiSchema['ui:options'];
    const uiErrors = uiSchema['ui:errorMessages'];

    expect(uiSchema['ui:title']).to.equal('Test Title');
    expect(uiSchema['ui:description']).to.equal('Test Description');
    expect(uiOptions.hint).to.equal('Test Hint');
    expect(uiOptions.width).to.equal('lg');
    expect(uiOptions.currencySymbol).to.equal('$');
    expect(uiOptions.min).to.equal(12);
    expect(uiOptions.max).to.equal(34);
    expect(uiErrors.required).to.equal('Enter an amount');
    expect(uiErrors.pattern).to.equal('Enter a valid dollar amount');
    expect(uiErrors.type).to.equal('Enter a valid dollar amount');
    expect(uiErrors.min).to.equal('Enter a number greater than or equal to 12');
    expect(uiErrors.max).to.equal('Enter a number less than or equal to 34');
  });

  it('should return a uiSchema with no min or max', () => {
    const uiSchema = currencyUI({
      title: 'Test Title',
      min: null,
      max: null,
    });

    const uiErrors = uiSchema['ui:errorMessages'];

    expect(uiSchema['ui:validations'].length).to.equal(0);
    expect(uiErrors.pattern).to.equal('Enter a valid dollar amount');
    expect(uiErrors.type).to.equal('Enter a valid dollar amount');
    expect(uiErrors.min).to.equal('');
    expect(uiErrors.max).to.equal('');
  });
});
