import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SubmitRefill from '../../components/SubmitRefill';

const props = {
  text: 'Button text',
};

describe('<SubmitRefill>', () => {
  test('should render', () => {
    const tree = SkinDeep.shallowRender(<SubmitRefill {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  test('should have the expected className', () => {
    const tree = SkinDeep.shallowRender(<SubmitRefill {...props}/>);

    expect(tree.props.className).to.equal('rx-refill-form');
  });

  test('should show the expected button text', () => {
    const tree = SkinDeep.shallowRender(<SubmitRefill {...props}/>);

    expect(tree.subTree('button').text()).to.equal('Button text');
  });
});
