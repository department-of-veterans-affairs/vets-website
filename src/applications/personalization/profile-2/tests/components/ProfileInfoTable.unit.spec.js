import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ProfileInfoTable from '../../components/ProfileInfoTable';

describe('ProfileInfoTable', () => {
  let dataTransformerSpy;
  const props = {
    title: 'Table Title',
    fieldName: 'profileField',
    data: [
      { title: 'row 1', value: 'value 1' },
      { title: 'row 2', value: 'value 2' },
    ],
  };
  let wrapper;
  beforeEach(() => {
    dataTransformerSpy = sinon.spy(arg => arg);
    props.dataTransformer = dataTransformerSpy;
    wrapper = shallow(<ProfileInfoTable {...props} />);
  });
  afterEach(() => {
    wrapper.unmount();
  });
  it('renders a `div`', () => {
    expect(wrapper.type()).to.equal('div');
  });
  it("sets the div's data-field-name to the fieldName prop", () => {
    expect(wrapper.prop('data-field-name')).to.equal(props.fieldName);
  });
  it('renders the title prop in an h3 tag', () => {
    const h3 = wrapper.find('h3');
    expect(h3.text()).to.equal(props.title);
  });
  it('renders a table row div for each entry in the data prop', () => {
    const tableRows = wrapper.find('div > div.table-row');
    expect(tableRows.length).to.equal(props.data.length);
  });
  it('calls the dataTransformer once for each row of data', () => {
    expect(dataTransformerSpy.callCount).to.equal(props.data.length);
  });
  it("renders each data object's title and value in a table row", () => {
    const tableRows = wrapper.find('tbody > tr');
    tableRows.forEach((row, index) => {
      const { title, value } = props.data[index];
      expect(row.text().includes(title)).to.be.true;
      expect(row.text().includes(value)).to.be.true;
    });
  });
});
