import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import CategoryInput from '../../components/ComposeForm/CategoryInput';

describe('CategoryInput component', () => {
  it('should not be empty', () => {
    const tree = SkinDeep.shallowRender(<CategoryInput />);

    expect(tree.subTree('.message-category')).not.to.be.empty;
  });

  it('should contain a legend element with "Category" text', () => {
    const tree = SkinDeep.shallowRender(<CategoryInput />);

    expect(tree.subTree('legend').text()).to.contain('Category');
  });
});
