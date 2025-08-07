import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import * as scrollUtil from 'platform/utilities/scroll';
import VeteranContactInformationReviewPage from '../../../components/VeteranContactInformationReviewPage';

describe('VeteranContactInformationReviewPage', () => {
  let goToPathSpy;
  let store;
  let scrollToStub;

  const mockData = {
    email: 'vet@example.com',
    phone: '8005551212',
    address: {
      country: 'USA',
      street: '1 Main St',
      city: 'Hometown',
      state: 'CA',
      postalCode: '90210',
    },
    internationalPhone: '441234567890',
  };

  beforeEach(() => {
    // minimal Redux store so useDispatch works
    store = createStore(() => ({}));

    // stub scrollTo so it doesn't error
    scrollToStub = sinon.stub(scrollUtil, 'scrollTo').callsFake(() => {});
  });

  afterEach(() => {
    cleanup();
    sessionStorage.clear();
    scrollToStub.restore();
  });

  it('renders all contact info fields and Edit buttons', () => {
    goToPathSpy = sinon.spy();
    const { container, getAllByText, getByRole } = render(
      <Provider store={store}>
        <VeteranContactInformationReviewPage
          data={mockData}
          goToPath={goToPathSpy}
        />
      </Provider>,
    );

    expect(getByRole('heading', { level: 4, name: /Mailing address/i })).to
      .exist;
    expect(getAllByText('Country')[0]).to.exist;
    expect(container.textContent).to.include('USA');
    expect(getAllByText('Street')[0]).to.exist;
    expect(container.textContent).to.include('1 Main St');
    expect(getAllByText('City')[0]).to.exist;
    expect(container.textContent).to.include('Hometown');
    expect(getAllByText('State')[0]).to.exist;
    expect(container.textContent).to.include('CA');
    expect(getAllByText('Postal code')[0]).to.exist;
    expect(container.textContent).to.include('90210');
    expect(getAllByText('Email address').length).to.be.greaterThan(1);

    const tel = container.querySelector('va-telephone');
    expect(tel).to.exist;
    expect(tel.getAttribute('contact')).to.equal('8005551212');

    expect(getByRole('heading', { level: 4, name: /International number/i })).to
      .exist;
    expect(container.textContent).to.include('441234567890');

    const editButtons = Array.from(
      container.querySelectorAll('va-button'),
    ).filter(btn => btn.getAttribute('text') === 'Edit');
    expect(editButtons.length).to.equal(4);
  });

  it('clicking Mailing Address Edit calls goToPath and sets sessionStorage', async () => {
    goToPathSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <VeteranContactInformationReviewPage
          data={mockData}
          goToPath={goToPathSpy}
        />
      </Provider>,
    );
    const editBtn = Array.from(container.querySelectorAll('va-button')).find(
      btn => btn.getAttribute('label') === 'Edit mailing address',
    );
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(sessionStorage.getItem('onReviewPage')).to.equal('mailingAddress');
      expect(goToPathSpy.calledOnce).to.be.true;
      expect(goToPathSpy.firstCall.args[0]).to.equal(
        '/veteran-contact-information/mailing-address',
      );
      expect(goToPathSpy.firstCall.args[1]).to.deep.equal({ force: true });
    });
  });

  it('clicking Email Edit calls goToPath and sets sessionStorage', async () => {
    goToPathSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <VeteranContactInformationReviewPage
          data={mockData}
          goToPath={goToPathSpy}
        />
      </Provider>,
    );
    const editBtn = Array.from(container.querySelectorAll('va-button')).find(
      btn => btn.getAttribute('label') === 'Edit email address',
    );
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(sessionStorage.getItem('onReviewPage')).to.equal('email');
      expect(goToPathSpy.calledOnce).to.be.true;
      expect(goToPathSpy.firstCall.args[0]).to.equal(
        'veteran-contact-information/email',
      );
      expect(goToPathSpy.firstCall.args[1]).to.deep.equal({ force: true });
    });
  });

  it('clicking Phone Edit calls goToPath and sets sessionStorage', async () => {
    goToPathSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <VeteranContactInformationReviewPage
          data={mockData}
          goToPath={goToPathSpy}
        />
      </Provider>,
    );
    const editBtn = Array.from(container.querySelectorAll('va-button')).find(
      btn => btn.getAttribute('label') === 'Edit home phone number',
    );
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(sessionStorage.getItem('onReviewPage')).to.equal('phone');
      expect(goToPathSpy.calledOnce).to.be.true;
      expect(goToPathSpy.firstCall.args[0]).to.equal(
        'veteran-contact-information/phone',
      );
      expect(goToPathSpy.firstCall.args[1]).to.deep.equal({ force: true });
    });
  });

  it('clicking International Phone Edit calls goToPath and sets sessionStorage', async () => {
    goToPathSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <VeteranContactInformationReviewPage
          data={mockData}
          goToPath={goToPathSpy}
        />
      </Provider>,
    );
    const editBtn = Array.from(container.querySelectorAll('va-button')).find(
      btn => btn.getAttribute('label') === 'Edit international phone number',
    );
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(sessionStorage.getItem('onReviewPage')).to.equal(
        'internationalPhone',
      );
      expect(goToPathSpy.calledOnce).to.be.true;
      expect(goToPathSpy.firstCall.args[0]).to.equal(
        'veteran-contact-information/international-phone',
      );
      expect(goToPathSpy.firstCall.args[1]).to.deep.equal({ force: true });
    });
  });

  it('renders error message if fields are missing', async () => {
    goToPathSpy = sinon.spy();
    const errorData = {
      address: {},
      email: null,
      phone: null,
      internationalPhone: null,
    };
    const { container } = render(
      <Provider store={store}>
        <VeteranContactInformationReviewPage
          data={errorData}
          goToPath={goToPathSpy}
        />
      </Provider>,
    );
    await waitFor(() => {
      const errors = container.querySelectorAll('.usa-input-error-message');
      expect(errors.length).to.be.at.least(6);
      expect(container.textContent).to.include('Missing country');
      expect(container.textContent).to.include('Missing street address line 1');
      expect(container.textContent).to.include('Missing city');
      expect(container.textContent).to.include('Missing province');
      expect(container.textContent).to.include('Missing postal code');
      expect(container.textContent).to.include('Missing email address');
    });
  });

  it('renders "Province" label for non-USA address', () => {
    goToPathSpy = sinon.spy();
    const data = {
      ...mockData,
      address: {
        ...mockData.address,
        country: 'CAN',
        state: 'BC',
      },
    };
    const { getByText } = render(
      <Provider store={store}>
        <VeteranContactInformationReviewPage
          data={data}
          goToPath={goToPathSpy}
        />
      </Provider>,
    );
    expect(getByText('Province')).to.exist;
  });

  it('renders "None provided" for missing phone/internationalPhone', () => {
    goToPathSpy = sinon.spy();
    const data = {
      ...mockData,
      phone: null,
      internationalPhone: null,
    };
    const { getAllByText } = render(
      <Provider store={store}>
        <VeteranContactInformationReviewPage
          data={data}
          goToPath={goToPathSpy}
        />
      </Provider>,
    );
    const noneProvided = getAllByText('None provided');
    expect(noneProvided.length).to.equal(2);
  });
});
