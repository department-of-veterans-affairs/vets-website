import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom-v5-compat';
import { DownloadLetters } from '../../containers/DownloadLetters';
import { chapters } from '../../utils/chapters';

describe('<DownloadLetters />', () => {
  it('renders the title and introduction', () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter initialEntries={[chapters[0].path]}>
        <DownloadLetters />
      </MemoryRouter>,
    );

    expect(getByTestId('form-title')).to.contain.text(
      'VA letters and documents',
    );
    expect(getByText(/Veterans need a letter proving their status/i)).to.exist;
  });

  it('displays correct step in the progress bar based on URL', () => {
    const testChapter = chapters[1];
    const { getByRole } = render(
      <MemoryRouter initialEntries={[testChapter.path]}>
        <DownloadLetters />
      </MemoryRouter>,
    );

    const stepHeader = getByRole('heading', { level: 2 });
    expect(stepHeader).to.contain.text(`Step 2 of ${chapters.length}`);
    expect(stepHeader).to.contain.text(testChapter.name);
  });
});
