import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import HelpSection from '../../../../components/complex-claims/pages/HelpSection';
import { FIND_FACILITY_TP_CONTACT_LINK } from '../../../../constants';

describe('HelpSection', () => {
  it('renders the Need help heading', () => {
    const screen = render(<HelpSection />);
    const heading = screen.getByRole('heading', { name: /need help/i });
    expect(heading).to.exist;
  });

  it('renders BTSSS call center phone number', () => {
    const { container } = render(<HelpSection />);

    // <va-telephone contact="8555747292" />
    const phone = container.querySelector('va-telephone[contact="8555747292"]');
    expect(phone).to.exist;

    // TTY line
    const tty = container.querySelector('va-telephone[tty][contact="711"]');
    expect(tty).to.exist;
  });

  it('renders facility travel contact paragraph', () => {
    const screen = render(<HelpSection />);

    expect(
      screen.getByText(
        /call your VA health facility’s Beneficiary Travel contact/i,
      ),
    ).to.exist;
  });

  it('renders the link to find a facility travel contact', () => {
    const { container } = render(<HelpSection />);

    // Assert link exists
    const link = container.querySelector(
      `va-link[href="${FIND_FACILITY_TP_CONTACT_LINK}"]`,
    );
    expect(link).to.exist;

    // Assert link text is present
    expect(
      container.querySelector(
        `va-link[text="Find the travel contact for your facility"]`,
      ),
    ).to.exist;
  });
});
