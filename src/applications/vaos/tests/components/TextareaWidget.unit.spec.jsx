import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import TextareaWidget from '../../components/TextareaWidget';

describe('VAOS <TextareaWidget>', () => {
  it('should render character limit', () => {
    const tree = shallow(
      <TextareaWidget value="Test" schema={{ maxLength: 20 }} />,
    );

    expect(tree.find('textarea').props().maxLength).to.equal(20);
    expect(tree.text()).to.contain('16 characters remaining');
    tree.unmount();
  });

  it('should call onChange', () => {
    const onChange = sinon.spy();
    const tree = shallow(
      <TextareaWidget onChange={onChange} value="Test" schema={{}} />,
    );

    tree
      .find('textarea')
      .props()
      .onChange({ target: { value: 'what' } });
    expect(onChange.calledWith('what')).to.be.true;
    tree.unmount();
  });
});
