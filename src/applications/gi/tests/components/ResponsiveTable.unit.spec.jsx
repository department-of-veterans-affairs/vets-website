import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ResponsiveTable from '../../components/ResponsiveTable';
import { createId } from '../../utils/helpers';

describe('<ResponsiveTable>', () => {
  it('should render', () => {
    const fields = ['Column 1'];
    const data = [
      {
        'Column 1': 'test',
      },
    ];
    const wrapper = shallow(<ResponsiveTable columns={fields} data={data} />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should set tableClass', () => {
    const fields = ['Column 1'];
    const data = [
      {
        'Column 1': 'test',
      },
    ];
    const wrapper = shallow(
      <ResponsiveTable
        columns={fields}
        data={data}
        tableClass={'table-class-name'}
      />,
    );
    expect(wrapper.find('.table-class-name')).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should render headers from columns', () => {
    const fields = ['Column 1'];
    const data = [
      {
        'Column 1': 'test',
      },
    ];
    const wrapper = shallow(
      <ResponsiveTable
        columns={fields}
        data={data}
        tableClass={'table-class-name'}
      />,
    );
    const column1 = wrapper.find('thead > tr > th');
    expect(column1).to.have.lengthOf(1);
    expect(column1.html()).to.contain(fields[0]);
    expect(column1.key()).to.equal(createId(fields[0]));
    expect(column1.props().role).to.equal('columnheader');
    expect(column1.props().scope).to.equal('col');

    wrapper.unmount();
  });

  it('should render rows from data', () => {
    const fields = ['Column 1'];
    const data = [
      {
        'Column 1': 'test',
        rowClassName: 'row-class-name',
        key: 'row-key',
      },
      {
        'Column 1': 'test',
        rowClassName: 'row-class-name-2',
        key: 'row-key',
      },
    ];
    const wrapper = shallow(
      <ResponsiveTable
        columns={fields}
        data={data}
        tableClass={'table-class-name'}
      />,
    );

    const row1 = wrapper.find(`.${data[0].rowClassName}`);
    expect(row1).to.have.lengthOf(1);
    expect(row1.key()).to.equal(data[0].key);
    expect(row1.props().role).to.equal('row');

    const column1 = wrapper.find(`.${data[0].rowClassName} th`);
    expect(column1).to.have.lengthOf(1);
    expect(column1.html()).to.contain(data[0]['Column 1']);

    wrapper.unmount();
  });

  it('should render first column in tbody as th', () => {
    const column1Header = 'Column 1';
    const fields = [column1Header, 'Column 2'];
    const row1Data = {
      [column1Header]: 'test',
      'Column 2': 'testt',
      rowClassName: 'row-class-name',
      key: 'row-key',
    };

    const data = [row1Data, { ...row1Data, column1Header: 'test2' }];
    const wrapper = shallow(
      <ResponsiveTable
        columns={fields}
        data={data}
        tableClass={'table-class-name'}
      />,
    );

    const column1 = wrapper.find(`.${createId(column1Header)}-cell`).first();
    expect(column1).to.have.lengthOf(1);
    expect(column1.html()).to.contain(row1Data[column1Header]);
    expect(column1.props().scope).to.equal('row');
    expect(column1.props().role).to.equal('rowheader');
    expect(column1.props().tabIndex).to.equal('-1');
    expect(column1.key()).to.equal(
      `${row1Data.key}-${createId(column1Header)}`,
    );

    expect(
      wrapper.containsAllMatchingElements([
        <span
          key={`${row1Data.key}-${createId(column1Header)}`}
        >{`${column1Header}: `}</span>,
      ]),
    ).to.equal(true);
    wrapper.unmount();
  });

  it('should render not first columns in tbody as td', () => {
    const column2Header = 'Column 2';
    const fields = ['Column 1', column2Header];
    const row1Data = {
      'Column 1': 'test',
      [column2Header]: 'testt',
      rowClassName: 'row-class-name',
      key: 'row-key',
    };

    const data = [row1Data, { ...row1Data, column2Header: 'testt2' }];
    const wrapper = shallow(
      <ResponsiveTable
        columns={fields}
        data={data}
        tableClass={'table-class-name'}
      />,
    );

    const column2 = wrapper.find(`.${createId(column2Header)}-cell`).first();
    expect(column2).to.have.lengthOf(1);

    expect(column2.html()).to.contain(row1Data[column2Header]);
    expect(column2.props().scope).to.be.undefined;
    expect(column2.props().role).to.equal('cell');
    expect(column2.props().tabIndex).to.be.undefined;
    expect(column2.key()).to.equal(
      `${row1Data.key}-${createId(column2Header)}`,
    );

    expect(
      wrapper.containsAllMatchingElements([
        <span
          key={`${row1Data.key}-${createId(column2Header)}`}
        >{`${column2Header}: `}</span>,
      ]),
    ).to.equal(true);

    wrapper.unmount();
  });
});
