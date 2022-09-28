import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import MessageCategoryInput from '../../components/ComposeForm/MessageCategoryInput';

describe('MessageCategoryInput component', () => {
  it('should not be empty', () => {
    const tree = SkinDeep.shallowRender(<MessageCategoryInput />);

    expect(tree.subTree('.message-category')).not.to.be.empty;
  });

  it('should contain a legend element with "Category" text', () => {
    const tree = SkinDeep.shallowRender(<MessageCategoryInput />);

    expect(tree.subTree('legend').text()).to.contain('Category');
  });
});
