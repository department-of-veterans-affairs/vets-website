import React from 'react';
import { render, waitFor } from '@testing-library/react';
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

  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  });

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

    expect(container.querySelector('va-button-pair[update]')).to.exist;
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

    container
      .querySelector('va-button-pair')
      .__events.secondaryClick(clickEvent);

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

    container.querySelector('va-button-pair').__events.primaryClick(clickEvent);

    await waitFor(() => {
      expect(goToPath.called).to.be.true;
    });
  });
});
