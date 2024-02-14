import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import TextWithLineBreaks from '../../components/TextWithLineBreaks';

describe('Avs: Text With Line Breaks', () => {
  it('correctly renders line breaks', async () => {
    const lines = [
      'Lorem ipsum dolor sit amet,',
      'consectetur adipiscing elit,',
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ];
    const text = lines.join('\n');
    const screen = render(<TextWithLineBreaks text={text} />);
    expect(screen.getAllByRole('presentation').length).to.eq(lines.length - 1);
  });
});
