import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ResponsiveTable from '../../../components/responsive-table/ResponsiveTable.jsx';
import { mockData, fields } from '../view-payments-lists/helpers';

describe('<ResponsiveTable />', () => {
  const fake = {};
  it('Should Render', () => {
    const wrapper = shallow(
      <ResponsiveTable
        fields={fields}
        data={mockData.received}
        currentSort={{
          value: 'Date',
          order: 'ASC',
        }}
      />,
    );

    expect(wrapper.exists('.responsive')).to.equal(true);
    wrapper.unmount();
  });

  it('should render the table header', () => {
    const wrapper = shallow(
      <ResponsiveTable
        fields={fields}
        data={mockData.received}
        currentSort={{
          value: 'Date',
          order: 'ASC',
        }}
      />,
    );

    expect(wrapper.find('thead')).to.have.lengthOf(1);
    expect(wrapper.find('th')).to.have.lengthOf(6); // Once for each field
    wrapper.unmount();
  });

  it('should render all of the rows', () => {
    const wrapper = shallow(
      <ResponsiveTable
        fields={fields}
        data={mockData.received}
        currentSort={{
          value: 'Date',
          order: 'ASC',
        }}
      />,
    );

    expect(wrapper.find('tr')).to.have.lengthOf(12); // includes header row
    wrapper.unmount();
  });
});
