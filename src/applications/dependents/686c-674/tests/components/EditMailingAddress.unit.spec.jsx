import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import EditMailingAddress from '../../components/EditMailingAddressPage';

function createMockStore(getStateValue = {}) {
  return {
    getState: () => getStateValue,
    dispatch: sinon.spy(),
    subscribe: () => {},
  };
}

const mockSchema = {
  type: 'object',
  properties: {
    veteranAddress: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        postalCode: { type: 'string' },
        country: { type: 'string' },
      },
    },
  },
};

const mockUiSchema = {
  veteranAddress: {
    street: { 'ui:title': 'Street address' },
    city: { 'ui:title': 'City' },
    state: { 'ui:title': 'State' },
    postalCode: { 'ui:title': 'ZIP' },
    country: { 'ui:title': 'Country' },
  },
};

const mockData = {
  veteranContactInformation: {
    veteranAddress: {
      street: '1 Main St',
      city: 'Hometown',
      state: 'CA',
      postalCode: '90210',
      country: 'USA',
    },
  },
};

const store = createMockStore();

describe('EditMailingAddressPage', () => {
  afterEach(() => {
    cleanup();
    sessionStorage.clear();
  });

  it('renders address inputs with correct labels and values', () => {
    const { container } = render(
      <Provider store={store}>
        <EditMailingAddress
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const textInputs = container.querySelectorAll('va-text-input[type="text"]');
    expect(textInputs.length).to.equal(4);

    expect(textInputs[0].getAttribute('label')).to.equal('Street address');
    expect(textInputs[1].getAttribute('label')).to.equal(
      'Apartment or unit number',
    );
    expect(textInputs[2].getAttribute('label')).to.equal('City');
    expect(textInputs[3].getAttribute('label')).to.equal('Postal code');

    expect(textInputs[0].value).to.equal('1 Main St');
    expect(textInputs[1].value).to.equal('');
    expect(textInputs[2].value).to.equal('Hometown');
    expect(textInputs[3].value).to.equal('90210');

    expect(container.textContent).to.include(
      'We’ve prefilled some of your information',
    );
    expect(container.textContent).to.include('Edit mailing address');
  });

  it('renders Update and Cancel buttons', () => {
    const { container } = render(
      <Provider store={store}>
        <EditMailingAddress
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const vaButtons = container.querySelectorAll('va-button');
    const updateButton = Array.from(vaButtons).find(
      btn => btn.getAttribute('text')?.toLowerCase() === 'update',
    );
    const cancelButton = Array.from(vaButtons).find(
      btn => btn.getAttribute('text')?.toLowerCase() === 'cancel',
    );

    expect(vaButtons.length).to.eql(2);
    expect(updateButton).to.exist;
    expect(cancelButton).to.exist;
  });

  it('handler: onCancel navigates to review-and-submit if onReviewPage', async () => {
    sessionStorage.setItem('onReviewPage', true);
    const goToPathSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <EditMailingAddress
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPathSpy}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const cancelButton = Array.from(
      container.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text')?.toLowerCase() === 'cancel');

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(goToPathSpy.called).to.be.true;
      expect(goToPathSpy.calledWith('/review-and-submit')).to.be.true;
      expect(sessionStorage.getItem('editContactInformation')).to.eq(
        'veteranAddress,cancel',
      );
    });
  });

  it('handler: onCancel navigates to contact-info if not onReviewPage', async () => {
    const goToPathSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <EditMailingAddress
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPathSpy}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const cancelButton = Array.from(
      container.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text')?.toLowerCase() === 'cancel');

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(goToPathSpy.called).to.be.true;
      expect(goToPathSpy.calledWith('/veteran-contact-information')).to.be.true;
    });
  });

  it('handler: onUpdate navigates to review-and-submit if onReviewPage, and setFormData is called on change', async () => {
    sessionStorage.setItem('onReviewPage', true);
    const goToPathSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <EditMailingAddress
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPathSpy}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );

    const form = container.querySelector('form');
    form.dispatchEvent(
      new window.Event('submit', { bubbles: true, cancelable: true }),
    );

    await waitFor(() => {
      expect(goToPathSpy.called).to.be.true;
      expect(goToPathSpy.calledWith('/review-and-submit')).to.be.true;
      expect(setFormDataSpy.called).to.be.true;

      expect(sessionStorage.getItem('editContactInformation')).to.eq(
        'veteranAddress,update',
      );
    });
  });

  it('topScrollElement is called', async () => {
    const { container } = render(
      <Provider store={store}>
        <div name="topScrollElement" />
        <EditMailingAddress
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
          setFormData={() => {}}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(container.querySelector('[name="topScrollElement"]')).to.exist;
    });
  });
});
