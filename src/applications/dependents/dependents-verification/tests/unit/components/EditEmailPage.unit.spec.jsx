import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import EditEmailPage from '../../../components/EditEmailPage';

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
    email: { type: 'string' },
  },
};

const mockUiSchema = {
  email: { 'ui:title': 'Email address' },
};

const mockData = {
  email: 'veteran@example.com',
};

describe('EditEmailPage', () => {
  let goToPath;

  beforeEach(() => {
    goToPath = sinon.spy();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders email input with correct label and value', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <EditEmailPage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
          setFormData={() => {}}
        />
      </Provider>,
    );

    expect(container.textContent).to.include('Email address');

    const input = container.querySelector(
      'input[type="text"], input[type="email"]',
    );
    expect(input.value).to.equal('veteran@example.com');

    expect(container.textContent).to.include('Edit email address');
  });

  it('renders Update and Cancel buttons', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <EditEmailPage
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
