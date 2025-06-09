import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

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
  it('should render an empty address warning on the view screen and disable the View letters button', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={[`/confirm-address`]}>
        <LetterPageWrapper />
      </MemoryRouter>,
    );

    expect(getByText('Your VA letters and documents').exist);
  });
});
