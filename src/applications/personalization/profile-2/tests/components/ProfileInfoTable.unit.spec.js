import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ProfileInfoTable from '../../components/ProfileInfoTable';

describe('ProfileInfoTable', () => {
  let dataTransformerSpy;
  let props;
  let wrapper;
  beforeEach(() => {
    dataTransformerSpy = sinon.spy(arg => arg);
    props = {
      title: 'Table Title',
      fieldName: 'profileField',
      data: [
        { title: 'row 1', value: 'value 1' },
        { title: 'row 2', value: 'value 2' },
      ],
      dataTransformer: dataTransformerSpy,
    };
    wrapper = shallow(<ProfileInfoTable {...props} />);
  });
  afterEach(() => {
    wrapper.unmount();
  });
  it('renders a `section`', () => {
    expect(wrapper.type()).to.equal('section');
  });
  it('renders the title prop in an h3 tag', () => {
    const h3 = wrapper.find('h3');
    expect(h3.text()).to.equal(props.title);
  });
  it('should render an h3 tag as the first child element', () => {
    expect(wrapper.childAt(0).type()).to.equal('h3');
  });
  it('renders a table row li for each entry in the data prop', () => {
    const tableRows = wrapper.find('ol > li.table-row');
    expect(tableRows.length).to.equal(props.data.length);
  });
  it('calls the dataTransformer once for each row of data', () => {
    expect(dataTransformerSpy.callCount).to.equal(props.data.length);
  });
  it("renders each data object's title and value in a `li.table-row`", () => {
    const tableRows = wrapper.find('ol > li.table-row');
    expect(tableRows.length).to.equal(props.data.length);
    tableRows.forEach((row, index) => {
      const { title, value } = props.data[index];
      expect(row.text().includes(title)).to.be.true;
      expect(row.text().includes(value)).to.be.true;
    });
  });
  describe('when no title is set', () => {
    beforeEach(() => {
      props = {
        fieldName: 'profileField',
        data: [
          { title: 'row 1', value: 'value 1' },
          { title: 'row 2', value: 'value 2' },
        ],
      };
      wrapper = shallow(<ProfileInfoTable {...props} />);
    });
    afterEach(() => {
      wrapper.unmount();
    });
    it('should not render an h3 tag', () => {
      const h3 = wrapper.find('h3');
      expect(h3.length).to.equal(0);
    });
    it('should render an ordered list as its first child', () => {
      const firstChild = wrapper.childAt(0);
      expect(firstChild.type()).to.equal('ol');
    });
  });
  describe('when the `list` prop is set', () => {
    beforeEach(() => {
      props = {
        fieldName: 'profileField',
        data: [{ title: 'row 1', value: 'value 1' }],
        list: true,
      };
      wrapper = shallow(<ProfileInfoTable {...props} />);
    });
    afterEach(() => {
      wrapper.unmount();
    });
    it('adds a `roll="list"` attribute to the ordered list', () => {
      const ol = wrapper.find('ol');
      expect(ol.props().role).to.equal('list');
    });
    it('adds a `role="listitem"` attribute to each row\'s li element', () => {
      const li = wrapper.find('li');
      expect(li.props().role).to.equal('listitem');
    });
  });
});
