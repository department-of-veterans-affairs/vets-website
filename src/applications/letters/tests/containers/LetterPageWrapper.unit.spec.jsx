import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
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
  it('should render header and description text', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={[`/confirm-address`]}>
        <LetterPageWrapper />
      </MemoryRouter>,
    );

    expect(getByText('Your VA benefit letters and documents').exist);
    expect(
      getByText(
        `When you apply for a benefit based on your VA status, you may need to provide a VA benefit letter or other documentation to prove you’re eligible.`,
      ).exist,
    );
  });
});
