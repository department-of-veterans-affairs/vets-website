import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import AddressBlock from '../../../src/js/letters/components/AddressBlock';

const defaultProps = { name: 'Gary Todd' };

describe('<AddressBlock/>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<AddressBlock { ...defaultProps }/>);
    const helpText = tree.subTree('p').text();

    expect(helpText).to.contain('When you download a letter');
  });

  it('should render name', () => {
    const tree = SkinDeep.shallowRender(<AddressBlock { ...defaultProps }/>);
    const helpText = tree.subTree('h5').text();

    expect(helpText).to.contain(defaultProps.name);
  });

  it('should render children', () => {
    const children = (<span>I am a child!</span>);
    const props = Object.assign({}, defaultProps, { children });
    const tree = SkinDeep.shallowRender(<AddressBlock { ...props }/>);
    const helpText = tree.dive(['div', 'span']).text();

    expect(helpText).to.contain('I am a child!');
  });
});
