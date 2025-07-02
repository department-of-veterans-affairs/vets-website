import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import EditMailingAddress from '../../../components/EditMailingAddress';

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
    address: {
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
  address: {
    street: { 'ui:title': 'Street address' },
    city: { 'ui:title': 'City' },
    state: { 'ui:title': 'State' },
    postalCode: { 'ui:title': 'ZIP' },
    country: { 'ui:title': 'Country' },
  },
};

const mockData = {
  address: {
    street: '1 Main St',
    city: 'Hometown',
    state: 'CA',
    postalCode: '90210',
    country: 'USA',
  },
};

describe('EditMailingAddress renders fields', () => {
  let goToPath;

  beforeEach(() => {
    goToPath = sinon.spy();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders address inputs with correct labels and values', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <EditMailingAddress
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
        />
      </Provider>,
    );
    const textInputs = container.querySelectorAll('input[type="text"]');
    expect(textInputs.length).to.equal(5);

    expect(container.textContent).to.include('Street address');
    expect(container.textContent).to.include('City');
    expect(container.textContent).to.include('State');
    expect(container.textContent).to.include('ZIP');
    expect(container.textContent).to.include('Country');

    expect(textInputs[0].value).to.equal('1 Main St');
    expect(textInputs[1].value).to.equal('Hometown');
    expect(textInputs[2].value).to.equal('CA');
    expect(textInputs[3].value).to.equal('90210');
    expect(textInputs[4].value).to.equal('USA');

    expect(container.textContent).to.include(
      'We’ve prefilled some of your information',
    );
    expect(container.textContent).to.include('Edit mailing address');
  });

  it('renders Save and Cancel buttons', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <EditMailingAddress
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
        />
      </Provider>,
    );

    const buttons = Array.from(container.querySelectorAll('va-button'));
    const saveButton = buttons.find(
      btn =>
        btn.getAttribute('text') === 'Save' || btn.textContent.includes('Save'),
    );
    const cancelButton = buttons.find(
      btn =>
        btn.getAttribute('text') === 'Cancel' ||
        btn.textContent.includes('Cancel'),
    );
    expect(saveButton).to.not.be.null;
    expect(cancelButton).to.not.be.null;
  });

  it('calls onCancel when cancel button is clicked + reviewPage', async () => {
    sessionStorage.setItem('onReviewPage', true);
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <EditMailingAddress
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPath}
        />
      </Provider>,
    );

    const cancelButton = container.querySelector('va-button[text="Cancel"]');

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(goToPath.called).to.be.true;
      expect(goToPath.calledWith('/review-and-submit')).to.be.true;
    });
  });

  it('calls onSubmit when Save button is clicked', async () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <EditMailingAddress
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPath}
        />
      </Provider>,
    );

    const cancelButton = container.querySelector('va-button[text="Save"]');

    fireEvent.submit(cancelButton);

    await waitFor(() => {
      expect(goToPath.called).to.be.true;
    });
  });
});
