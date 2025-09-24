import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import ConnectedConfirmationPage from '../../containers/ConfirmationPage';

const mockStore = configureStore([]);

describe('<ConfirmationPage>', () => {
  it('renders the complete submission steps alert', () => {
    const store = mockStore({
      form: {
        submission: { timestamp: '2025-05-23T12:00:00Z' },
        formId: '22-1919',
        data: {},
      },
    });

    const mockRouter = {
      push: () => {},
    };

    const mockRoute = {
      formConfig: {
        trackingPrefix: 'edu-1919',
      },
    };

    const { getByText } = render(
      <Provider store={store}>
        <ConnectedConfirmationPage router={mockRouter} route={mockRoute} />
      </Provider>,
    );

    expect(getByText('Complete all submission steps')).to.exist;

    expect(getByText(/This form requires additional steps/)).to.exist;
  });

  it('renders the process list with download step', () => {
    const store = mockStore({
      form: {
        submission: { timestamp: '2025-05-23T12:00:00Z' },
        formId: '22-1919',
        data: {},
      },
    });

    const mockRouter = {
      push: () => {},
    };

    const mockRoute = {
      formConfig: {
        trackingPrefix: 'edu-1919',
      },
    };

    const { getByText, container } = render(
      <Provider store={store}>
        <ConnectedConfirmationPage router={mockRouter} route={mockRoute} />
      </Provider>,
    );

    expect(getByText('To submit your form, follow the steps below')).to.exist;

    expect(getByText('Download and save your form')).to.exist;

    expect($('va-link[text="Download VA Form 22-1919"]', container)).to.exist;
  });

  it('renders the upload instructions step', () => {
    const store = mockStore({
      form: {
        submission: { timestamp: '2025-05-23T12:00:00Z' },
        formId: '22-1919',
        data: {},
      },
    });

    const mockRouter = {
      push: () => {},
    };

    const mockRoute = {
      formConfig: {
        trackingPrefix: 'edu-1919',
      },
    };

    const { getByText, container } = render(
      <Provider store={store}>
        <ConnectedConfirmationPage router={mockRouter} route={mockRoute} />
      </Provider>,
    );

    expect(
      $(
        'va-process-list-item[header*="Upload the form to the Education File Upload Portal"]',
        container,
      ),
    ).to.exist;

    expect(getByText(/If your institution has a facility code/)).to.exist;

    expect($('va-link[text="Education File Upload Portal"]', container)).to
      .exist;

    expect(getByText(/If your institution does not have a facility code/)).to
      .exist;
    expect($('va-link[text="search the SAA contact directory"]', container)).to
      .exist;
  });

  it('renders the next steps section', () => {
    const store = mockStore({
      form: {
        submission: { timestamp: '2025-05-23T12:00:00Z' },
        formId: '22-1919',
        data: {},
      },
    });

    const mockRouter = {
      push: () => {},
    };

    const mockRoute = {
      formConfig: {
        trackingPrefix: 'edu-1919',
      },
    };

    const { getByText, container } = render(
      <Provider store={store}>
        <ConnectedConfirmationPage router={mockRouter} route={mockRoute} />
      </Provider>,
    );

    expect($('va-process-list-item[header="Next steps"]', container)).to.exist;

    expect(
      getByText(
        /We will generally review your submission within 7-10 business days/,
      ),
    ).to.exist;

    expect(
      getByText(
        /If you uploaded your form to the Education File Upload Portal/,
      ),
    ).to.exist;

    expect(getByText(/If you emailed your form to your SAA/)).to.exist;
  });

  it('renders the action buttons', () => {
    const store = mockStore({
      form: {
        submission: { timestamp: '2025-05-23T12:00:00Z' },
        formId: '22-1919',
        data: {},
      },
    });

    const mockRouter = {
      push: () => {},
    };

    const mockRoute = {
      formConfig: {
        trackingPrefix: 'edu-1919',
      },
    };

    const { getByTestId, container } = render(
      <Provider store={store}>
        <ConnectedConfirmationPage router={mockRouter} route={mockRoute} />
      </Provider>,
    );

    expect($('va-button[text="Print this page"]', container)).to.exist;
    expect(getByTestId('print-page')).to.exist;

    expect($('va-link[text="Back"]', container)).to.exist;
    expect(getByTestId('back-button')).to.exist;
  });

  it('renders the download link with correct URL', () => {
    const store = mockStore({
      form: {
        submission: { timestamp: '2025-05-23T12:00:00Z' },
        formId: '22-1919',
        data: {},
      },
    });

    const mockRouter = {
      push: () => {},
    };

    const mockRoute = {
      formConfig: {
        trackingPrefix: 'edu-1919',
      },
    };

    const { getByTestId, container } = render(
      <Provider store={store}>
        <ConnectedConfirmationPage router={mockRouter} route={mockRoute} />
      </Provider>,
    );

    expect(getByTestId('download-link')).to.exist;

    const downloadLink = $(
      'va-link[download="true"][text="Download VA Form 22-1919"]',
      container,
    );
    expect(downloadLink).to.exist;
    expect(downloadLink.getAttribute('filetype')).to.equal('PDF');
  });
});
