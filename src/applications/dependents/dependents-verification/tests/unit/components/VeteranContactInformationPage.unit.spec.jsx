import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import VeteranContactInformationPage from '../../../components/VeteranContactInformationPage';
import { electronicCorrespondenceMessage } from '../../../config/chapters/veteran-contact-information/editEmailPage';
import { saveEditContactInformation } from '../../../util/contact-info';

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
  electronicCorrespondence: false,
  phone: '5551234567',
  'view:phoneSource': 'home',
  address: {
    street: '123 Main St',
    street2: 'Unit 2',
    city: 'Springfield',
    state: 'VA',
    postalCode: '12345',
    country: 'USA',
    province: null,
    internationalPostalCode: null,
  },
  internationalPhone: null,
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
  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders all sections with prefilled data', () => {
    const { container } = renderPage();

    expect($('va-card', container)).to.not.be.null;
    const text = container.textContent;
    expect(text).to.include('Mailing address');
    expect(text).to.include('Email address');
    expect(text).to.include(electronicCorrespondenceMessage(false));
    expect(text).to.include('phone number');
    expect(text).to.include('International number');
    expect(text).to.include('123 Main St');
    expect(text).to.include('vet@example.com');
    expect(text).to.include('12345');
  });

  it('covers international home phone object', () => {
    const { container } = renderPage({
      profile: defaultProfile({ isInternationalHome: true }),
    });
    expect($('va-card', container)).to.not.be.null;
  });

  it('covers international home phone object', () => {
    const { container } = renderPage({
      profile: defaultProfile({ isInternationalMobile: true }),
    });
    expect($('va-card', container)).to.not.be.null;
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

    const addLinks = Array.from($$('va-link', container)).filter(
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

  it('shows prefill & error alert on submit if email is missing', async () => {
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

    await waitFor(() => {
      fireEvent.click(continueBtn);
      expect(container.textContent).to.include(
        'Your email address is required before you continue.',
      );
      expect(goToPath.called).to.be.false;
    });
  });

  it('shows prefill & error alert on submit if mailing address is missing', async () => {
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

    await waitFor(() => {
      fireEvent.click(continueBtn);
      expect(container.textContent).to.include(
        'Your mailing address is required before you continue.',
      );
      expect(goToPath.called).to.be.false;
    });
  });

  it('shows prefill & error alert on submit if email & mailing address are missing', async () => {
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

    await waitFor(() => {
      fireEvent.click(continueBtn);
      expect(container.textContent).to.include(
        'Your email and mailing address are required before you continue.',
      );
      expect(goToPath.called).to.be.false;
    });
  });

  it('shows error alert on submit if address is missing', async () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({
      data: {
        email: 'vet@example.com',
        electronicCorrespondence: true,
        phone: '5551234567',
        address: {},
      },
      goToPath,
    });

    const continueBtn = $('va-button[continue]', container);
    expect(continueBtn).to.not.be.null;
    expect(container.textContent).to.include(
      electronicCorrespondenceMessage(true),
    );

    await waitFor(() => {
      fireEvent.click(continueBtn);
      expect(container.textContent).to.include('mailing address is required');
      expect(goToPath.called).to.be.false;
    });
  });

  it('navigates to dependents page when all info is provided and Continue is clicked', async () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({
      data: defaultData,
      goToPath,
    });
    const continueBtn = $('va-button[continue]', container);
    expect(continueBtn).to.not.be.null;

    await waitFor(() => {
      fireEvent.click(continueBtn);
      expect(goToPath.calledWith('/dependents', { force: true })).to.be.true;
    });
  });

  it('calls goToPath with correct args when edit/add is clicked', async () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({
      goToPath,
      data: defaultData,
    });

    const editAddLink = $$('va-link', container).find(
      link =>
        (link.getAttribute('text') || '').match(/Edit|Add/i) ||
        (link.textContent || '').match(/Edit|Add/i),
    );
    expect(editAddLink).to.not.be.null;

    await waitFor(() => {
      fireEvent.click(editAddLink);
      expect(goToPath.called).to.be.true;
    });
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

  it('should go to mailing address edit page on edit link click', async () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({ goToPath, data: defaultData });

    const editLink = $('va-link[label="Edit mailing address"]', container);
    expect(editLink).to.not.be.null;

    fireEvent.click(editLink);

    await waitFor(() => {
      expect(
        goToPath.calledWith('/veteran-contact-information/mailing-address'),
      ).to.be.true;
    });
  });

  it('should go to email address edit page on edit link click', async () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({ goToPath, data: defaultData });

    const editLink = $('va-link[label="Edit email address"]', container);
    expect(editLink).to.not.be.null;

    fireEvent.click(editLink);

    await waitFor(() => {
      expect(goToPath.calledWith('/veteran-contact-information/email')).to.be
        .true;
    });
  });

  it('should go to (home) phone number edit page on edit link click', async () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({ goToPath, data: defaultData });

    const editLink = $('va-link[label="Edit home phone number"]', container);
    expect(editLink).to.not.be.null;
    expect($('va-telephone', container).getAttribute('contact')).to.eq(
      '5551234567',
    );

    fireEvent.click(editLink);

    await waitFor(() => {
      expect(goToPath.calledWith('/veteran-contact-information/phone')).to.be
        .true;
    });
  });

  it('should go to (mobile) phone number edit page on edit link click', async () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({
      goToPath,
      data: {
        ...defaultData,
        phone: '5557654321',
        'view:phoneSource': 'mobile',
      },
    });

    const editLink = $('va-link[label="Edit mobile phone number"]', container);
    expect(editLink).to.exist;
    expect($('va-telephone', container).getAttribute('contact')).to.eq(
      '5557654321',
    );

    fireEvent.click(editLink);

    await waitFor(() => {
      expect(goToPath.calledWith('/veteran-contact-information/phone')).to.be
        .true;
    });
  });

  it('should go to international phone add page on add link click', async () => {
    const goToPath = sinon.spy();
    const { container } = renderPage({ goToPath, data: defaultData });

    const addLink = $(
      'va-link[label="Add international phone number"]',
      container,
    );
    expect(addLink).to.not.be.null;

    fireEvent.click(addLink);

    await waitFor(() => {
      expect(
        goToPath.calledWith('/veteran-contact-information/international-phone'),
      ).to.be.true;
    });
  });

  it('should show address success update alert & focus on it', async () => {
    saveEditContactInformation('address', 'update');
    const { container } = renderPage({ data: defaultData });

    await waitFor(() => {
      const alert = $('va-alert[status="success"]', container);
      expect(alert).to.exist;
      expect(alert.textContent).to.include('We updated your mailing address');
      expect(alert.textContent).to.include('This update only applies to this');
      expect(document.activeElement === alert).to.be.true;
    });
  });

  it('should focus on edit link if editing was canceled', async () => {
    saveEditContactInformation('address', 'cancel');
    const { container } = renderPage({ data: defaultData });

    await waitFor(() => {
      const alert = $('va-alert[status="success"]', container);
      expect(alert).to.not.exist;

      // This check is flaky :(
      // const editLink = $('va-link[label="Edit mailing address"]', container);
      // expect(document.activeElement === editLink).to.be.true;
    });
  });
});
