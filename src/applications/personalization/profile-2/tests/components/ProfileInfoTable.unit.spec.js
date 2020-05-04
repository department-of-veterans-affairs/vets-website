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
  it("sets the section's data-field-name to the fieldName prop", () => {
    expect(wrapper.prop('data-field-name')).to.equal(props.fieldName);
  });
  it('renders the title prop in an h3 tag', () => {
    const h3 = wrapper.find('h3');
    expect(h3.text()).to.equal(props.title);
  });
  it('should render an h3 tag as the first child element', () => {
    expect(wrapper.childAt(0).type()).to.equal('h3');
  });
  it('does not set a role on the description list', () => {
    const dl = wrapper.find('dl');
    expect(dl.props().role).to.be.undefined;
  });
  it("does not set a role on each row's dt element", () => {
    const tableRows = wrapper.find('dl > div.table-row');
    tableRows.forEach(row => {
      expect(row.find('dt').props.role).to.be.undefined;
    });
  });
  it('renders a table row div for each entry in the data prop', () => {
    const tableRows = wrapper.find('dl > div.table-row');
    expect(tableRows.length).to.equal(props.data.length);
  });
  it('calls the dataTransformer once for each row of data', () => {
    expect(dataTransformerSpy.callCount).to.equal(props.data.length);
  });
  it("renders each data object's title and value in a `div.table-row`", () => {
    const tableRows = wrapper.find('dl > div.table-row');
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
    it('should render a description list as its first child', () => {
      const firstChild = wrapper.childAt(0);
      expect(firstChild.type()).to.equal('dl');
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
    it('adds a `roll="list"` attribute to the description list', () => {
      const dl = wrapper.find('dl');
      expect(dl.props().role).to.equal('list');
    });
    it('adds a `role="listitem"` attribute to each row\'s dt element', () => {
      const dt = wrapper.find('dl dt');
      expect(dt.props().role).to.equal('listitem');
    });
  });
});
