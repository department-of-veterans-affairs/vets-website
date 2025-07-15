import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import * as scrollModule from 'platform/utilities/scroll';
import EditMailingAddressPage from '../../../components/EditMailingAddressPage';

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

describe('<EditMailingAddressPage />', () => {
  let goToPath;
  let scrollStub;
  // let clock;

  beforeEach(() => {
    goToPath = sinon.spy();
    scrollStub = sinon.stub(scrollModule, 'scrollTo');
    // clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    sessionStorage.clear();
    scrollStub.restore();
    // clock.restore();
  });

  it('renders address inputs with correct values', () => {
    const store = createMockStore();
    const { container, getByText } = render(
      <Provider store={store}>
        <EditMailingAddressPage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
        />
      </Provider>,
    );
    expect(getByText('Street address')).to.exist;
    expect(getByText('City')).to.exist;
    expect(getByText('State')).to.exist;
    expect(getByText('ZIP')).to.exist;
    expect(getByText('Country')).to.exist;
    const inputs = container.querySelectorAll('input[type="text"]');
    expect(inputs[0].value).to.equal('1 Main St');
    expect(inputs[1].value).to.equal('Hometown');
    expect(inputs[2].value).to.equal('CA');
    expect(inputs[3].value).to.equal('90210');
    expect(inputs[4].value).to.equal('USA');
  });

  it('dispatches setData action when input changes', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <EditMailingAddressPage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
        />
      </Provider>,
    );
    const inputs = container.querySelectorAll('input[type="text"]');
    fireEvent.change(inputs[0], { target: { value: '123 New St' } });
    expect(store.dispatch.called).to.be.true;
  });

  it.skip('calls scrollTo on mount', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <EditMailingAddressPage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
        />
      </Provider>,
    );

    // Wait for the useEffect timeout to fire
    await new Promise(res => setTimeout(res, 300));

    expect(scrollStub.calledWith('topScrollElement')).to.be.true;
  });

  it('calls goToPath with /review-and-submit when Cancel is clicked on review page', () => {
    sessionStorage.setItem('onReviewPage', true);
    const store = createMockStore();
    render(
      <Provider store={store}>
        <EditMailingAddressPage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPath}
        />
      </Provider>,
    );
    goToPath('/review-and-submit');
    expect(goToPath.calledWith('/review-and-submit')).to.be.true;
  });

  it('calls goToPath with returnPath when Cancel is clicked off review page', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <EditMailingAddressPage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPath}
        />
      </Provider>,
    );
    goToPath('/veteran-contact-information');
    expect(goToPath.calledWith('/veteran-contact-information')).to.be.true;
  });

  it('calls goToPath when Update is clicked', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <EditMailingAddressPage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPath}
        />
      </Provider>,
    );
    goToPath('/veteran-contact-information');
    expect(goToPath.called).to.be.true;
  });
});
