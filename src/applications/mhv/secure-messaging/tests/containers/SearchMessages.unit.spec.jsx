import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import SearchMessages from '../../containers/SearchMessages';

describe('SearchMessages container', () => {
  it('should not be empty', () => {
    const tree = SkinDeep.shallowRender(<SearchMessages />);

    expect(tree.subTree('.search-messages')).not.to.be.empty;
  });

  it('should contain an h1 element with page title', () => {
    const tree = SkinDeep.shallowRender(<SearchMessages />);

    expect(tree.subTree('.page-title').text()).to.equal('Search messages');
  });
});
