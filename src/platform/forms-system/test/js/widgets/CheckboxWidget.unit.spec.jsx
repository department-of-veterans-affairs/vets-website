import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import CheckboxWidget from '../../../src/js/widgets/CheckboxWidget';

describe('Schemaform <CheckboxWidget>', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <CheckboxWidget
        id="1"
        value
        required
        disabled={false}
        onChange={onChange}
        options={{ title: 'Title' }}
      />,
    );
    expect(tree.text()).to.include('Title');
    expect(tree.subTree('input').props.checked).to.be.true;
    expect(tree.everySubTree('.form-required-span')).not.to.be.empty;
  });
  it('should handle change', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <CheckboxWidget
        id="1"
        value
        required
        disabled={false}
        onChange={onChange}
        options={{ title: 'Title' }}
      />,
    );
    tree.subTree('input').props.onChange({
      target: {
        checked: false,
      },
    });
    expect(onChange.calledWith(false)).to.be.true;
  });
  it('should add custom props', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <CheckboxWidget
        id="1"
        required
        disabled={false}
        onChange={onChange}
        options={{
          widgetProps: {
            false: { 'data-test': 'unchecked' },
          },
        }}
      />,
    );
    expect(tree.subTree('input').props['data-test']).to.equal('unchecked');
  });
});
