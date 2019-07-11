import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { DownloadLetters } from '../../containers/DownloadLetters';

const defaultProps = {
  address: {
    address1: 'asdf', // Just something so this isn't seen as a blank address
  },
  location: {
    pathname: '/confirm-address',
  },
};

describe('<DownloadLetters>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<DownloadLetters {...defaultProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});
