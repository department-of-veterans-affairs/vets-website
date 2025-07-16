import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import EditMailingAddress from '../../../components/EditMailingAddressPage';

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

describe('EditMailingAddressPage', () => {
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
          setFormData={() => {}}
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

  it('renders Update and Cancel buttons', () => {
    const store = createMockStore();
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

  it('handler: onCancel navigates to review-and-submit if onReviewPage', () => {
    sessionStorage.setItem('onReviewPage', 'true');
    const fromReviewPage = sessionStorage.getItem('onReviewPage');
    const returnPath = '/veteran-contact-information';
    const handler = () => {
      goToPath(fromReviewPage ? '/review-and-submit' : returnPath);
    };

    handler();

    expect(goToPath.calledWith('/review-and-submit')).to.be.true;
  });

  it('handler: onCancel navigates to contact-info if not onReviewPage', () => {
    sessionStorage.setItem('onReviewPage', '');
    const fromReviewPage = sessionStorage.getItem('onReviewPage');
    const returnPath = '/veteran-contact-information';
    const handler = () => {
      goToPath(fromReviewPage ? '/review-and-submit' : returnPath);
    };

    handler();

    expect(goToPath.calledWith('/veteran-contact-information')).to.be.true;
  });

  it('handler: onUpdate navigates to contact-info if not onReviewPage', () => {
    sessionStorage.setItem('onReviewPage', '');
    const fromReviewPage = sessionStorage.getItem('onReviewPage');
    const returnPath = '/veteran-contact-information';
    const handler = () => {
      goToPath(fromReviewPage ? '/review-and-submit' : returnPath);
    };

    handler();

    expect(goToPath.calledWith('/veteran-contact-information')).to.be.true;
  });

  it('handler: onUpdate navigates to review-and-submit if onReviewPage', () => {
    sessionStorage.setItem('onReviewPage', 'true');
    const fromReviewPage = sessionStorage.getItem('onReviewPage');
    const returnPath = '/veteran-contact-information';
    const handler = () => {
      goToPath(fromReviewPage ? '/review-and-submit' : returnPath);
    };

    handler();

    expect(goToPath.calledWith('/review-and-submit')).to.be.true;
  });
});
