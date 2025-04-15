import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import LetterPageWrapper from '../../containers/LetterPageWrapper';

describe('<LetterPageWrapper>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <MemoryRouter>
        <LetterPageWrapper />
      </MemoryRouter>,
    );
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});
