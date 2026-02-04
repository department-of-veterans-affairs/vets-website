import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import * as environment from 'platform/utilities/environment';
import ConfirmationPage from '../../../containers/ConfirmationPage';

const mockFormConfig = {
  rootUrl: '/forms/upload',
  urlPrefix: '/21-0779/',
  formId: '21-0779-UPLOAD',
  title: 'Upload VA Form 21-0779',
  chapters: {
    uploadChapter: {
      title: 'Upload',
      pages: {},
    },
  },
  submitUrl: 'https://dev-api.va.gov/simple_forms_api/v1/submit_scanned_form',
  trackingPrefix: 'form-21-0779-upload-',
  customText: { appType: 'form' },
  hideReviewChapters: true,
  saveInProgress: {
    messages: {
      inProgress: 'Your form upload is in progress.',
      expired:
        'Your form upload has expired. If you want to upload a form, please start a new request.',
      saved: 'Your form upload has been saved.',
    },
  },
};

describe('ConfirmationPage', () => {
  const mockStore = configureStore([thunk]);

  const createStore = (customState = {}) => {
    const defaultState = {
      form: {
        formId: '21-0779-UPLOAD',
        submission: {
          timestamp: '2025-10-30T10:00:00Z',
          response: {
            attributes: {
              confirmationNumber: 'CONF-123-456',
            },
          },
        },
        data: {
          veteranFullName: {
            first: 'John',
            middle: 'M',
            last: 'Veteran',
          },
        },
      },
    };

    return mockStore({
      ...defaultState,
      ...customState,
    });
  };

  beforeEach(() => {
    sinon.stub(environment, 'isProduction').returns(false);
    sinon.stub(environment, 'isStaging').returns(false);
  });

  afterEach(() => {
    cleanup();
  });

  const renderComponent = (store, props = {}) => {
    return render(
      <Provider store={store}>
        <ConfirmationPage route={{ formConfig: mockFormConfig }} {...props} />
      </Provider>,
    );
  };

  it('should render success alert', () => {
    const store = createStore();
    renderComponent(store);

    const alert = document.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attr('status', 'success');
  });

  it('should display correct contact information', () => {
    const store = createStore();
    const { container } = renderComponent(store);

    const phoneLink = container.querySelector('va-telephone');
    expect(phoneLink).to.exist;

    const askVaLink = container.querySelector(
      'va-link[href="https://ask.va.gov/"]',
    );
    expect(askVaLink).to.exist;
  });

  it('should throw error when form state is missing', () => {
    const store = createStore({ form: undefined });
    expect(() => renderComponent(store)).to.throw();
  });
});
