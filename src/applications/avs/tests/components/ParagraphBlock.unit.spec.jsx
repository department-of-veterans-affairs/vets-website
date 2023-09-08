import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ParagraphBlock from '../../components/ParagraphBlock';

describe('Avs: Paragraph Block', () => {
  it('correctly renders all data', async () => {
    const heading = 'This is a test heading';
    const content = 'This is some test content. It has some more words.';
    const props = { heading, content };
    const screen = render(<ParagraphBlock {...props} />);
    expect(screen.getByRole('heading')).to.have.text(heading);
    expect(screen.getByText(content)).to.exist;
    expect(screen.getByText(content))
      .to.have.attribute('data-testid')
      .match(/this-is-a-test-heading/);
    expect(screen.getByTestId('this-is-a-test-heading')).to.have.text(content);
  });

  it('is hidden if there is no content', async () => {
    const heading = 'This is a test heading';
    const content = '';
    const props = { heading, content };
    const screen = render(<ParagraphBlock {...props} />);
    expect(screen.queryByTestId('this-is-a-test-heading')).to.not.exist;
  });
});
