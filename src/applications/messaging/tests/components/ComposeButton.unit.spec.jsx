import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ComposeButton from '../../components/ComposeButton';

describe('<ComposeButton>', () => {
  test('should render correctly', () => {
    const tree = SkinDeep.shallowRender(<ComposeButton/>);

    expect(tree.getRenderOutput()).to.exist;
  });

  test('should have the expected default classname', () => {
    const tree = SkinDeep.shallowRender(<ComposeButton/>);

    expect(tree.props.className).to.equal('messaging-compose-button va-button-primary');
  });

  test('should have the expected classname when disabled', () => {
    const tree = SkinDeep.shallowRender(<ComposeButton disabled/>);

    expect(tree.props.className).to.equal('messaging-compose-button usa-button-disabled');
  });

  test('should render disabled button when disabled', () => {
    const tree = SkinDeep.shallowRender(<ComposeButton disabled/>);

    expect(tree.subTree('button').props.disabled).to.equal(true);
  });
});
