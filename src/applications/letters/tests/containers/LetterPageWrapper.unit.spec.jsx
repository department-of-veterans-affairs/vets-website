import React from 'react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import { render } from '@testing-library/react';
import LetterPageWrapper from '../../containers/LetterPageWrapper';

describe('<LetterPageWrapper>', () => {
  it('should render', () => {
    const { container } = render(
      <MemoryRouter>
        <LetterPageWrapper />
      </MemoryRouter>,
    );
    expect(container).to.exist;
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
        `When you apply for a benefit based on your VA status, you may need to provide a VA benefit letter or other documents to prove your eligibility.`,
      ).exist,
    );
  });
});
