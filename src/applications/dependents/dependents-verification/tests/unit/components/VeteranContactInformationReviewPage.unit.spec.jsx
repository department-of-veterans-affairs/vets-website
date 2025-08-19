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
  let clock;

  const mockData = {
    email: 'vet@example.com',
    'view:phoneSource': 'home',
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
    clock = sinon.useFakeTimers({
      now: Date.now(),
      toFake: ['setTimeout', 'clearTimeout'],
    });
    store = createStore(() => ({}));
    sinon.spy(store, 'dispatch');
    scrollToStub = sinon.stub(scrollUtil, 'scrollTo').callsFake(() => {});
  });

  afterEach(() => {
    cleanup();
    sessionStorage.clear();
    clock.restore();
    scrollToStub.restore();
    store.dispatch.restore();
  });

  it('removes onReviewPage from sessionStorage on mount if present', async () => {
    sessionStorage.setItem('onReviewPage', 'email');
    render(
      <Provider store={store}>
        <VeteranContactInformationReviewPage
          data={mockData}
          goToPath={() => {}}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(sessionStorage.getItem('onReviewPage')).to.be.null;
    });
  });

  it('does not dispatch or scroll if no onReviewPage in sessionStorage', async () => {
    render(
      <Provider store={store}>
        <VeteranContactInformationReviewPage
          data={mockData}
          goToPath={() => {}}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(store.dispatch.notCalled).to.be.true;
      expect(scrollToStub.notCalled).to.be.true;
    });
  });

  it('renders all contact info fields and Edit buttons', async () => {
    goToPathSpy = sinon.spy();
    const { container, getAllByText, getByRole } = render(
      <Provider store={store}>
        <VeteranContactInformationReviewPage
          data={mockData}
          goToPath={goToPathSpy}
        />
      </Provider>,
    );

    await waitFor(() => {
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

      expect(getByRole('heading', { level: 4, name: /International number/i }))
        .to.exist;
      expect(container.textContent).to.include('441234567890');

      const editButtons = Array.from(
        container.querySelectorAll('va-button'),
      ).filter(btn => btn.getAttribute('text') === 'Edit');
      expect(editButtons.length).to.equal(4);
    });
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

    await waitFor(() => {
      const editBtn = Array.from(container.querySelectorAll('va-button')).find(
        btn => btn.getAttribute('label') === 'Edit mailing address',
      );
      fireEvent.click(editBtn);
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

    await waitFor(() => {
      const editBtn = Array.from(container.querySelectorAll('va-button')).find(
        btn => btn.getAttribute('label') === 'Edit email address',
      );
      fireEvent.click(editBtn);
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

    await waitFor(() => {
      const editBtn = Array.from(container.querySelectorAll('va-button')).find(
        btn => btn.getAttribute('label') === 'Edit home phone number',
      );
      fireEvent.click(editBtn);
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

    await waitFor(() => {
      const editBtn = Array.from(container.querySelectorAll('va-button')).find(
        btn => btn.getAttribute('label') === 'Edit international phone number',
      );
      fireEvent.click(editBtn);
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
});
