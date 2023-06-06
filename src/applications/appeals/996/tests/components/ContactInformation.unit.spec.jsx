import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { ContactInfoDescription } from '../../components/ContactInformation';

const getData = ({
  email = true,
  mobile = true,
  address = true,
  submitted = false,
  homeless = false,
} = {}) => {
  const veteran = {};
  if (email) {
    veteran.email = 'someone@famous.com';
  }
  if (mobile) {
    veteran.phone = {
      areaCode: '555',
      phoneNumber: '8001212',
      extension: '1234',
    };
  }
  if (address) {
    veteran.address = {
      addressType: 'DOMESTIC',
      countryName: 'United States',
      countryCodeIso3: 'USA',
      addressLine1: '123 Main Blvd',
      addressLine2: 'Floor 33',
      addressLine3: 'Suite 55',
      city: 'Hollywood',
      stateCode: 'CA',
      zipCode: '90210',
    };
  }
  return {
    formContext: { submitted },
    formData: { veteran },
    homeless,
  };
};

describe('Veteran information review content', () => {
  it('should render inline contact information', () => {
    const data = getData();
    const { container } = render(<ContactInfoDescription {...data} />);
    const wrapper = $('.va-profile-wrapper', container);

    expect($('va-telephone', container).getAttribute('contact')).to.eq(
      '5558001212',
    );
    expect(wrapper.textContent).to.include('someone@famous.com');
    expect(wrapper.textContent).to.include('123 Main Blvd, Floor 33, Suite 55');
    expect(wrapper.textContent).to.include('Hollywood, CA 90210');
  });

  it('should not throw JS error when contact info value is null', () => {
    const data = getData();
    data.formData.veteran = {
      mobilePhone: null,
      mailingAddress: null,
      email: null,
    };

    const { container } = render(<ContactInfoDescription {...data} />);

    expect($$('a[aria-label^="Edit "]', container).length).to.eq(3);
  });

  it('should render note about missing phone', () => {
    const data = getData({ mobile: false });
    const { container } = render(<ContactInfoDescription {...data} />);

    expect($('va-alert', container).innerHTML).to.include(
      'Your phone is missing',
    );
  });
  it('should render note about missing email & phone', () => {
    const data = getData({ mobile: false, email: false });
    const { container } = render(<ContactInfoDescription {...data} />);

    expect($('va-alert', container).innerHTML).to.include(
      'Your email and phone are missing',
    );
  });
  it('should render note about missing email, phone & address', () => {
    const data = getData({ mobile: false, email: false, address: false });
    const { container } = render(<ContactInfoDescription {...data} />);

    expect($('va-alert', container).innerHTML).to.include(
      'Your email, phone and address are missing',
    );
  });
  it('should render note about missing address if not homeless', () => {
    const data = getData({ email: false, address: false, homeless: false });
    const { container } = render(<ContactInfoDescription {...data} />);

    expect($('va-alert', container).innerHTML).to.include(
      'Your email and address are missing',
    );
  });
  it('should should not include missing address if homeless', () => {
    const data = getData({ email: false, address: false, homeless: true });
    const { container } = render(<ContactInfoDescription {...data} />);

    expect($('va-alert', container).innerHTML).to.include(
      'Your email is missing',
    );
  });

  it('should render an error if info is not actually updated', async () => {
    const data = getData({
      submitted: false,
      email: false,
    });
    const { container, rerender } = render(
      <ContactInfoDescription {...data} />,
    );
    const alert = $('va-alert', container);

    expect(alert.getAttribute('status')).to.eq('warning');
    expect(alert.innerHTML).to.include('Your email is missing');

    data.formContext.submitted = true;
    await rerender(<ContactInfoDescription {...data} />);

    await waitFor(() => {
      const alerts = $$('va-alert', container);
      expect(alerts.length).to.eq(2);
      expect(alerts[0].getAttribute('status')).to.eq('error');
      expect(alerts[1].getAttribute('status')).to.eq('warning');
    });
  });

  it('should render note about missing address & show success after updating', async () => {
    const data = getData({
      submitted: false,
      email: false,
    });
    const { container, rerender } = render(
      <ContactInfoDescription {...data} />,
    );
    const alert = $('va-alert', container);

    expect(alert.getAttribute('status')).to.eq('warning');
    expect(alert.innerHTML).to.include('Your email is missing');

    await rerender(<ContactInfoDescription {...getData()} />);
    // should update & call useEffect here

    const success = $$('va-alert', container);
    expect(success.length).to.eq(1);
    expect(success[0].getAttribute('status')).to.eq('success');
  });
});
