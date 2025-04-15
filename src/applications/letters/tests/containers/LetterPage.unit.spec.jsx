import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import LetterPage from '../../containers/LetterPage';

describe('<LetterPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <MemoryRouter>
        <LetterPage />
      </MemoryRouter>,
    );
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});
