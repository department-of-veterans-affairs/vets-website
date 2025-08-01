import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import GetFormHelp from '../../../components/GetFormHelp';

describe('new-28-1900 <GetFormHelp>', () => {
  it('renders the phone numbers and help link', () => {
    const { container } = render(<GetFormHelp />);

    const mainTel = container.querySelector(
      'va-telephone[contact="8008271000"]',
    );
    const ttyTel = container.querySelector(
      'va-telephone[contact="711"][tty="true"]',
    );
    const helpLink = container.querySelector(
      'va-link[href="/get-help-from-accredited-representative/"]',
    );

    expect(mainTel).to.exist;
    expect(ttyTel).to.exist;
    expect(helpLink).to.exist;
    expect(helpLink.getAttribute('text')).to.match(
      /accredited representative/i,
    );
  });
});
