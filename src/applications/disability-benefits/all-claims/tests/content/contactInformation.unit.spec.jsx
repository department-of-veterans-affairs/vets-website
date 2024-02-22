import { render } from '@testing-library/react';
import {
  forwardingAddressDescription,
  ForwardingAddressViewField,
  phoneEmailViewField,
} from '../../content/contactInformation';

describe('contactInformation', () => {
  describe('ForwardingAddressViewField', () => {
    it('renders when "from" and "to" date are included', () => {
      const formData = {
        city: 'Anytown',
        country: 'USA',
        effectiveDate: { from: '2020-01-31', to: '2020-02-14' },
        state: 'CA',
      };

      const tree = render(ForwardingAddressViewField({ formData }));

      tree.getByText(
        'We’ll use this address starting on Jan. 31, 2020 until Feb. 14, 2020',
        { exact: false }, // ignore whitespace
      );
    });

    it('renders when only "from" date is included', () => {
      const formData = {
        city: 'Anytown',
        country: 'USA',
        effectiveDate: { from: '2020-01-31' },
        state: 'CA',
      };

      const tree = render(ForwardingAddressViewField({ formData }));

      tree.getByText(
        'We’ll use this address starting on Jan. 31, 2020',
        { exact: false }, // ignore whitespace
      );
    });
  });

  describe('phoneEmailViewField', () => {
    it('renders with phone and email', () => {
      const formData = {
        primaryPhone: '5551234567',
        emailAddress: 'nobody@example.com',
      };

      const tree = render(phoneEmailViewField({ formData }));
      tree.getByText('555-123-4567', { exact: false });
      tree.getByText(formData.emailAddress, { exact: false });
    });

    it('renders with phone only', () => {
      const formData = {
        primaryPhone: '5551234567',
        emailAddress: '',
      };

      const tree = render(phoneEmailViewField({ formData }));
      tree.getByText('555-123-4567', { exact: false });
    });
  });

  describe('forwardingAddressDescription', () => {
    it('renders', () => {
      const tree = render(forwardingAddressDescription());
      tree.getByText('If you give us a temporary or forwarding address', {
        exact: false,
      });
    });
  });
});
