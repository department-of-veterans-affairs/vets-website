import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import InvalidAddress from '../../../src/js/letters/components/InvalidAddress';

describe('InvalidAddress', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<InvalidAddress/>);
    const alertText = tree.subTree('p').text();

    expect(alertText).to.contain('We’re encountering an error with your address');
  });
});
