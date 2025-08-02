import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import GetFormHelp from './GetFormHelp';

describe('<GetFormHelp />', () => {
  it('renders help text and phone numbers', () => {
    const { container } = render(<GetFormHelp />);

    const helpParagraph = container.querySelector('p.help-talk');
    const mainPhone = container.querySelector(
      'va-telephone[contact="8008271000"]',
    );
    const ttyPhone = container.querySelector(
      'va-telephone[contact="711"][tty="true"]',
    );

    expect(helpParagraph, 'Expected help paragraph to be rendered').to.exist;
    expect(helpParagraph.textContent).to.include('form isn’t working right');
    expect(mainPhone, 'Expected main VA telephone component').to.exist;
    expect(ttyPhone, 'Expected TTY VA telephone component').to.exist;
  });
});
