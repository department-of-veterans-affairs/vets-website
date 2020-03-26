import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import SystemsRadioWidget from '../../components/SystemsRadioWidget';

describe('Schemaform <SystemsRadioWidget>', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const tree = shallow(
      <SystemsRadioWidget
        value
        onChange={onChange}
        options={{ enumOptions }}
        formContext={{ cernerFacilities: [] }}
      />,
    );
    expect(tree.find('input').length).to.equal(2);
    expect(
      tree
        .find('label')
        .at(0)
        .text(),
    ).to.equal('Testing');
    expect(
      tree
        .find('label')
        .at(1)
        .text(),
    ).to.equal('Testing2');
    tree.unmount();
  });
  it('should render label from options', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const labels = {
      1: 'Other',
    };
    const tree = shallow(
      <SystemsRadioWidget
        value
        onChange={onChange}
        options={{ enumOptions, labels }}
        formContext={{ cernerFacilities: [] }}
      />,
    );
    expect(
      tree
        .find('label')
        .at(0)
        .text(),
    ).to.equal('Other');
    expect(
      tree
        .find('label')
        .at(1)
        .text(),
    ).to.equal('Testing2');
    tree.unmount();
  });
  it('should handle change', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '1',
      },
      {
        label: 'Testing2',
        value: '2',
      },
    ];
    const tree = shallow(
      <SystemsRadioWidget
        value
        onChange={onChange}
        options={{ enumOptions }}
        formContext={{ cernerFacilities: [] }}
      />,
    );
    tree
      .find('input')
      .at(0)
      .props()
      .onChange();
    expect(onChange.calledWith('1')).to.be.true;
    tree.unmount();
  });
  it('should disable Cerner facilities', () => {
    const onChange = sinon.spy();
    const enumOptions = [
      {
        label: 'Testing',
        value: '983',
      },
      {
        label: 'Testing2',
        value: '984',
      },
    ];
    const tree = shallow(
      <SystemsRadioWidget
        value
        onChange={onChange}
        options={{ enumOptions }}
        formContext={{ cernerFacilities: ['984'] }}
      />,
    );

    expect(
      tree
        .find('input')
        .at(0)
        .props().disabled,
    ).to.be.false;
    expect(
      tree
        .find('input')
        .at(1)
        .props().disabled,
    ).to.be.true;
    expect(
      tree
        .find('label')
        .at(1)
        .text(),
    ).to.contain('To schedule a VA appointment at this location');
    tree.unmount();
  });
});
