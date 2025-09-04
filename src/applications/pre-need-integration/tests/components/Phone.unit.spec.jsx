import { expect } from 'chai';
import uiSchema from '../../components/Phone';

describe('Pre-need definition phone uiSchema', () => {
  it('should return an object', () => {
    const result = uiSchema();
    expect(result).to.be.an('object');
  });

  it('should default to title Phone', () => {
    const result = uiSchema();
    expect(result['ui:title']).to.equal('Phone');
  });

  it('should use a custom title if provided', () => {
    const customTitle = 'Cell Phone';
    const result = uiSchema(customTitle);
    expect(result['ui:title']).to.equal(customTitle);
  });

  it('should set the correct widget types', () => {
    const result = uiSchema();
    expect(result['ui:widget']).to.exist;
    expect(result['ui:reviewWidget']).to.exist;
  });

  it('should set autocomplete to tel', () => {
    const result = uiSchema();
    expect(result['ui:autocomplete']).to.equal('tel');
  });

  it('should set error messages for pattern, minLength, required', () => {
    const result = uiSchema();
    expect(result['ui:errorMessages']).to.have.property('pattern');
    expect(result['ui:errorMessages']).to.have.property('minLength');
    expect(result['ui:errorMessages']).to.have.property('required');
    expect(result['ui:errorMessages'].pattern).to.match(/digits/);
    expect(result['ui:errorMessages'].required).to.match(/phone number/);
  });

  it('should set widgetClassNames option', () => {
    const result = uiSchema();
    expect(result['ui:options']).to.have.property('widgetClassNames');
    expect(result['ui:options'].widgetClassNames).to.equal('phone');
  });
});
