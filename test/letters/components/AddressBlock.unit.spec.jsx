import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import AddressBlock from '../../../src/js/letters/components/AddressBlock';

const defaultProps = { name: 'Gary Todd' };

describe('<AddressBlock/>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<AddressBlock { ...defaultProps }/>);
    const helpText = tree.subTree('p').text();

    expect(helpText).to.contain('A correct address is not required, but');
  });
});
