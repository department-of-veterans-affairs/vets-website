import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import VeteranContactInformationPage from '../../../components/VeteranContactInformationPage';

const defaultProfile = ({
  isInternationalHome = false,
  isInternationalMobile = false,
  hasAddress = true,
  hasEmail = true,
} = {}) => ({
  vapContactInfo: {
    email: {
      emailAddress: hasEmail ? 'vet@example.com' : '',
    },
    mailingAddress: hasAddress
      ? {
          addressType: 'DOMESTIC',
          addressLine1: '123 Main St',
          addressLine2: 'Unit 2',
          city: 'Springfield',
          stateCode: 'VA',
          province: '',
          zipCode: '12345',
          internationalPostalCode: '',
          countryCodeIso3: 'USA',
        }
      : {},
    homePhone: {
      areaCode: '555',
      phoneNumber: '1234567',
      isInternational: isInternationalHome,
      countryCode: isInternationalHome ? '44' : '',
    },
    mobilePhone: {
      areaCode: '555',
      phoneNumber: '7654321',
      isInternational: isInternationalMobile,
      countryCode: isInternationalHome ? '44' : '',
    },
  },
  userFullName: {
    first: 'Jane',
    last: 'Doe',
  },
});

const defaultData = {
  email: 'vet@example.com',
  phone: '5551234567',
  address: {
    street: '123 Main St',
    street2: 'Unit 2',
    city: 'Springfield',
    state: 'VA',
    postalCode: '12345',
    country: 'USA',
    province: '',
    internationalPostalCode: '',
  },
  internationalPhone: '',
};

function renderPage({
  data = defaultData,
  goBack = () => {},
  goToPath = () => {},
  setFormData = () => {},
  profile = defaultProfile(),
  contentBeforeButtons = null,
  contentAfterButtons = null,
} = {}) {
  const mockStore = {
    getState: () => ({ user: { profile } }),
    dispatch: () => {},
    subscribe: () => {},
  };
  return render(
    <Provider store={mockStore}>
      <VeteranContactInformationPage
        data={data}
        goBack={goBack}
        goToPath={goToPath}
        setFormData={setFormData}
        contentBeforeButtons={contentBeforeButtons}
        contentAfterButtons={contentAfterButtons}
      />
    </Provider>,
  );
}

describe('VeteranContactInformationPage (querySelector-only)', () => {
  it('renders all sections with prefilled data', () => {
    const { container } = renderPage();

    expect(container.querySelector('va-card')).to.not.be.null;
    expect(container.textContent).to.include('Mailing address');
    expect(container.textContent).to.include('Email address');
    expect(container.textContent).to.include('phone number');
    expect(container.textContent).to.include('International phone number');
    expect(container.textContent).to.include('123 Main St');
    expect(container.textContent).to.include('vet@example.com');
    expect(container.textContent).to.include('12345');
  });

  it('covers international home phone ojbect', () => {
    const { container } = renderPage({
      profile: defaultProfile({ isInternationalHome: true }),
    });

    expect(container.querySelector('va-card')).to.not.be.null;
  });

  it('covers international home phone ojbect', () => {
    const { container } = renderPage({
      profile: defaultProfile({ isInternationalMobile: true }),
    });

    expect(container.querySelector('va-card')).to.not.be.null;
  });

  it('shows add links and "None provided" if info is missing', () => {
    const { container } = renderPage({
      data: {
        email: '',
        phone: '',
        address: {},
        internationalPhone: '',
      },
      profile: {
        vapContactInfo: {},
      },
    });

    const addLinks = Array.from(container.querySelectorAll('va-link')).filter(
      link =>
        (link.getAttribute('text') || '').match(/Add/i) ||
        (link.textContent || '').match(/Add/i),
    );
    expect(addLinks.length).to.be.above(0);
    expect(container.textContent).to.include('None provided');
  });

  it('does not show missing prefill alert if prefill data in place', () => {
    const { container } = renderPage({
      data: {
        email: '',
        phone: '',
        address: {},
        internationalPhone: '',
      },
    });
    expect($$('va-alert', container)).to.have.lengthOf(0);
  });

  it('shows prefill & error alert on submit if email is missing', () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({
      data: {
        email: '',
        phone: '5551234567',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'VA',
          postalCode: '12345',
          country: 'USA',
        },
      },
      profile: defaultProfile({ hasEmail: false }),
      goToPath,
    });

    expect(container.textContent).to.include(
      'We could not prefill this form with your email address.',
    );

    const continueBtn = $('va-button[continue]', container);
    expect(continueBtn).to.not.be.null;
    fireEvent.click(continueBtn);

    expect(container.textContent).to.include(
      'Your email address is required before you continue.',
    );

    expect(goToPath.called).to.be.false;
  });

  it('shows prefill & error alert on submit if mailing address is missing', () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({
      data: {
        email: 'test@test.com',
        phone: '5551234567',
        address: {},
      },
      profile: defaultProfile({ hasAddress: false }),
      goToPath,
    });

    expect(container.textContent).to.include(
      'We could not prefill this form with your mailing address.',
    );

    const continueBtn = $('va-button[continue]', container);
    expect(continueBtn).to.not.be.null;
    fireEvent.click(continueBtn);

    expect(container.textContent).to.include(
      'Your mailing address is required before you continue.',
    );

    expect(goToPath.called).to.be.false;
  });

  it('shows prefill & error alert on submit if email & mailing address are missing', () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({
      data: {
        email: '',
        phone: '',
        address: {},
      },
      profile: defaultProfile({ hasAddress: false, hasEmail: false }),
      goToPath,
    });

    expect(container.textContent).to.include(
      'We could not prefill this form with your email and mailing address.',
    );

    const continueBtn = $('va-button[continue]', container);
    expect(continueBtn).to.not.be.null;
    fireEvent.click(continueBtn);

    expect(container.textContent).to.include(
      'Your email and mailing address are required before you continue.',
    );

    expect(goToPath.called).to.be.false;
  });

  it('shows error alert on submit if address is missing', () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({
      data: {
        email: 'vet@example.com',
        phone: '5551234567',
        address: {},
      },
      goToPath,
    });

    const continueBtn = container.querySelector('va-button[continue]');
    expect(continueBtn).to.not.be.null;
    fireEvent.click(continueBtn);
    expect(container.textContent).to.include('mailing address is required');
    expect(goToPath.called).to.be.false;
  });

  it('navigates to dependents page when all info is provided and Continue is clicked', () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({
      data: defaultData,
      goToPath,
    });
    const continueBtn = container.querySelector('va-button[continue]');
    expect(continueBtn).to.not.be.null;
    fireEvent.click(continueBtn);
    expect(goToPath.calledWith('/dependents', { force: true })).to.be.true;
  });

  it('calls goToPath with correct args when edit/add is clicked', () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({
      goToPath,
      data: defaultData,
    });

    const editAddLink = Array.from(container.querySelectorAll('va-link')).find(
      link =>
        (link.getAttribute('text') || '').match(/Edit|Add/i) ||
        (link.textContent || '').match(/Edit|Add/i),
    );
    expect(editAddLink).to.not.be.null;
    fireEvent.click(editAddLink);
    expect(goToPath.called).to.be.true;
  });

  it('shows prefill warning alert if profile is missing info', () => {
    const { container } = renderPage({
      data: {
        email: '',
        phone: '',
        address: {},
        internationalPhone: '',
      },
      profile: {
        vapContactInfo: {},
      },
    });
    expect(container.textContent).to.include('We could not prefill this form');
  });
});
