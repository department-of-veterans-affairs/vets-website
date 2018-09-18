import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Disclaimer from '../../components/Disclaimer';

const props = {
  isOpen: true,
  handleClose: () => {},
};

describe('<Disclaimer>', () => {
  test('should render', () => {
    const tree = SkinDeep.shallowRender(<Disclaimer {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  test('should have the expected class name', () => {
    const tree = SkinDeep.shallowRender(<Disclaimer {...props}/>);

    expect(tree.props.className).to.equal('va-alert--open usa-alert usa-alert-warning');
  });

  test('should render expected button text when open', () => {
    const tree = SkinDeep.shallowRender(<Disclaimer {...props}/>);

    expect(tree.everySubTree('i').pop().text()).to.equal('Hide this message');
  });

  test('should render expected button text when closed', () => {
    const tree = SkinDeep.shallowRender(<Disclaimer {...props} isOpen={false}/>);

    expect(tree.everySubTree('i').pop().text()).to.equal('Show this message');
  });
});
