import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  MailDescription,
  InPersonDescription,
  ConfirmationDescription,
} from '../../../components/claim-files-tab-v2/Descriptions';

describe('<Descriptions>', () => {
  describe('<MailDescription>', () => {
    const mockAddress = {
      organization: 'Department of Veterans Affairs',
      department: 'Evidence Intake Center',
      poBox: 'PO Box 4444',
      city: 'Janesville',
      state: 'WI',
      zip: '53547-4444',
    };

    it('should render with provided address props', () => {
      const { getByText, container } = render(
        <MailDescription address={mockAddress} />,
      );

      expect(getByText('Mail the document to this address:')).to.exist;
      expect(container.textContent).to.include(mockAddress.organization);
      expect(container.textContent).to.include(mockAddress.department);
      expect(container.textContent).to.include(mockAddress.poBox);
      expect(container.textContent).to.include(mockAddress.city);
      expect(container.textContent).to.include(mockAddress.state);
      expect(container.textContent).to.include(mockAddress.zip);
    });

    it('should render address block with correct CSS class', () => {
      const { container } = render(<MailDescription address={mockAddress} />);

      const addressBlock = container.querySelector('.va-address-block');
      expect(addressBlock).to.exist;
    });
  });

  describe('<InPersonDescription>', () => {
    const mockLink = '/test-locations';

    it('should render with provided link prop', () => {
      const { getByText, container } = render(
        <InPersonDescription findVaLocations={mockLink} />,
      );

      expect(getByText('Bring the document to a VA regional office.')).to.exist;

      const link = container.querySelector(`va-link[href="${mockLink}"]`);
      expect(link).to.exist;
      expect(link.getAttribute('text')).to.equal(
        'Find a VA regional office near you',
      );
    });
  });

  describe('<ConfirmationDescription>', () => {
    const mockContactInfo = {
      phone: '555-123-4567',
      tty: '555-123-4568',
      hours: 'Monday through Friday, 9:00 a.m. to 5:00 p.m. PT',
    };

    it('should render with provided contact info props', () => {
      const { container } = render(
        <ConfirmationDescription contactInfo={mockContactInfo} />,
      );
      expect(container.textContent).to.include(
        'To confirm we’ve received a document you submitted by mail or in person, call us at 555-123-4567 (TTY: 555-123-4568). We’re here Monday through Friday, 9:00 a.m. to 5:00 p.m. PT.',
      );
    });
  });
});
