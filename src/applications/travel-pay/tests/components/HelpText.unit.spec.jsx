import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { ComplexClaimsHelpSection } from '../../components/HelpText';
import { FIND_FACILITY_TP_CONTACT_LINK } from '../../constants';

describe('ComplexClaimsHelpSection', () => {
  it('renders the Need help heading', () => {
    const screen = render(<ComplexClaimsHelpSection />);
    const heading = screen.getByRole('heading', { name: /need help/i });
    expect(heading).to.exist;
  });

  it('renders BTSSS call center phone number', () => {
    const { container } = render(<ComplexClaimsHelpSection />);

    // <va-telephone contact="8555747292" />
    const phone = container.querySelector('va-telephone[contact="8555747292"]');
    expect(phone).to.exist;

    // TTY line
    const tty = container.querySelector('va-telephone[tty][contact="711"]');
    expect(tty).to.exist;
  });

  it('renders facility travel contact paragraph', () => {
    const screen = render(<ComplexClaimsHelpSection />);

    expect(
      screen.getByText(
        /call your VA health facility’s Beneficiary Travel contact/i,
      ),
    ).to.exist;
  });

  it('renders the link to find a facility travel contact', () => {
    const { container } = render(<ComplexClaimsHelpSection />);

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
