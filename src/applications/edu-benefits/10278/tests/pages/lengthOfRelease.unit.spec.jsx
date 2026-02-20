import { expect } from 'chai';

import { schema, uiSchema } from '../../pages/lengthOfRelease';

describe('10278 lengthOfRelease page', () => {
  it('exports uiSchema with title, description, and duration radio field', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema).to.have.property('ui:title');
    expect(uiSchema).to.have.property('ui:description');
    expect(uiSchema).to.have.nested.property('lengthOfRelease.duration');

    const durationUI = uiSchema.lengthOfRelease.duration;
    const options = durationUI['ui:options'] || {};
    const labels = options.labels || {};

    expect(labels).to.have.property('ongoing');
    expect(labels).to.have.property('date');
  });

  it('exports uiSchema with date field that expands under duration', () => {
    const dateUI = uiSchema.lengthOfRelease.date;
    expect(dateUI).to.be.an('object');

    const options = dateUI['ui:options'] || {};
    expect(options).to.have.property('expandUnder', 'duration');
    expect(options)
      .to.have.property('expandUnderCondition')
      .that.is.a('function');
  });

  it('expandUnderCondition returns true only when value is "date"', () => {
    const dateUI = uiSchema.lengthOfRelease.date;
    const { expandUnderCondition } = dateUI['ui:options'];

    expect(expandUnderCondition('date')).to.equal(true);
    expect(expandUnderCondition('ongoing')).to.equal(false);
    expect(expandUnderCondition(undefined)).to.equal(false);
  });

  it('exports schema with required duration and date properties', () => {
    expect(schema).to.be.an('object');
    expect(schema).to.have.property('type', 'object');
    expect(schema).to.have.nested.property('properties.lengthOfRelease');

    const lengthOfReleaseSchema = schema.properties.lengthOfRelease;
    expect(lengthOfReleaseSchema).to.have.property('required');
    expect(lengthOfReleaseSchema.required).to.deep.equal(['duration']);

    expect(lengthOfReleaseSchema).to.have.nested.property(
      'properties.duration',
    );
    expect(lengthOfReleaseSchema).to.have.nested.property('properties.date');
  });
});
