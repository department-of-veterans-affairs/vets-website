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

  it('does not interpret html by default', async () => {
    const heading = 'This is a test heading';
    const content = 'This is some <b>test content</b>. It has some more words.';
    const props = { heading, content };
    const screen = render(<ParagraphBlock {...props} />);
    expect(screen.getByTestId('this-is-a-test-heading')).to.contain.text('<b>');
  });

  it('interprets html when option is used', async () => {
    const heading = 'This is a test heading';
    const content = 'This is some <b>test content</b>. It has some more words.';
    const htmlContent = true;
    const props = { heading, content, htmlContent };
    const screen = render(<ParagraphBlock {...props} />);
    expect(screen.getByTestId('this-is-a-test-heading')).not.to.contain.text(
      '<b>',
    );
  });

  it('defaults the heading level to h3', async () => {
    const heading = 'This is a test heading';
    const content = 'This is some test content. It has some more words.';
    const props = { heading, content };
    const screen = render(<ParagraphBlock {...props} />);
    expect(screen.getByRole('heading', { level: 3 })).to.have.text(heading);
  });

  it('allows setting the heading level', async () => {
    const heading = 'This is a test heading';
    const content = 'This is some test content. It has some more words.';
    const headingLevel = 5;
    const props = { heading, content, headingLevel };
    const screen = render(<ParagraphBlock {...props} />);
    expect(screen.getByRole('heading', { level: headingLevel })).to.have.text(
      heading,
    );
  });

  it('is hidden if there is no content', async () => {
    const heading = 'This is a test heading';
    const content = '';
    const props = { heading, content };
    const screen = render(<ParagraphBlock {...props} />);
    expect(screen.queryByTestId('this-is-a-test-heading')).to.not.exist;
  });
});
