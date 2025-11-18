import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AvsPageHeader from '../../components/AvsPageHeader.tsx';

describe('Avs: Page Header Component', () => {
  it('correctly renders line breaks', async () => {
    const lines = [
      'Lorem ipsum dolor sit amet,',
      'consectetur adipiscing elit,',
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ];
    const text = lines.join('\n');
    const screen = render(<AvsPageHeader text={text} />);
    expect(screen.getAllByRole('presentation').length).to.eq(lines.length - 1);
  });

  it('removes "After Visit Summary" line', async () => {
    const lines = [
      'After Visit Summary',
      'Lorem ipsum dolor sit amet,',
      'consectetur adipiscing elit,',
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ];
    const text = lines.join('\n');
    const screen = render(<AvsPageHeader text={text} />);
    expect(screen.getAllByRole('presentation').length).to.eq(lines.length - 2);
  });

  it('removes "After-visit Summary" line', async () => {
    const lines = [
      'After-visit Summary',
      'Lorem ipsum dolor sit amet,',
      'consectetur adipiscing elit,',
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ];
    const text = lines.join('\n');
    const screen = render(<AvsPageHeader text={text} />);
    expect(screen.getAllByRole('presentation').length).to.eq(lines.length - 2);
  });
});
