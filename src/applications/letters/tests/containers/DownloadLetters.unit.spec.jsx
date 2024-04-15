import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import { DownloadLetters } from '../../containers/DownloadLetters';

describe('<DownloadLetters>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <MemoryRouter>
        <DownloadLetters />
      </MemoryRouter>,
    );
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});
