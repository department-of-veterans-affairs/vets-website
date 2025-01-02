import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { ProgramSummary, arrayBuilderOptions } from '../../pages';

const MockProgramSummary = () => <div />;

describe('ProgramSummary', () => {
  it('should have the correct uiSchema', () => {
    const wrapper = shallow(<MockProgramSummary />);
    expect(ProgramSummary.uiSchema).to.have.property('view:programsSummary');
    const uiSchemaView = ProgramSummary.uiSchema['view:programsSummary'];
    expect(uiSchemaView).to.have.property(
      'ui:title',
      'Do you have another program to add?',
    );
    wrapper.unmount();
  });
  it('should have the correct schema', () => {
    expect(ProgramSummary.schema).to.have.property('type', 'object');
    expect(ProgramSummary.schema).to.have.property('properties');
    expect(ProgramSummary.schema.properties).to.have.property(
      'view:programsSummary',
    );
  });
  it('should return the correct item name from getItemName', () => {
    const testItem = { programName: 'My Awesome Program' };
    const name = arrayBuilderOptions.text.getItemName(testItem);

    expect(name).to.equal('My Awesome Program');
  });
});
