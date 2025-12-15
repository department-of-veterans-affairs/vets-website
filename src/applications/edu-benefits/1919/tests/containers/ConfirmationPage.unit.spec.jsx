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
  it('reverts the .custom-classname heading from <h3> back to <h2> on unmount (cleanup effect)', () => {
    const store = mockStore({
      form: {
        submission: { timestamp: '2025-05-23T12:00:00Z' },
        formId: '22-1919',
        data: {},
      },
    });
    const mockRouter = { push: () => {} };
    const mockRoute = { formConfig: { trackingPrefix: 'edu-1919' } };

    const { unmount, getByText, container } = render(
      <Provider store={store}>
        <ConnectedConfirmationPage router={mockRouter} route={mockRoute} />
      </Provider>,
    );

    // Verify the mount effect converted inner H2 → H3
    const headlineNode = getByText('Download and save your form');
    const h3 = headlineNode.closest('h3');
    expect(h3, 'expected the mount effect to convert H2 → H3').to.exist;
    expect(container.querySelector('.custom-classname h3')).to.exist;

    // ---- Stub document.querySelector DURING UNMOUNT to return a fake <h3> ----
    const originalQS = document.querySelector;
    const replaceCalls = [];
    const fakeParent = {
      replaceChild: (newNode, oldNode) => {
        replaceCalls.push({ newNode, oldNode });
        return oldNode;
      },
    };
    const fakeH3 = {
      innerHTML: 'Download and save your form',
      parentNode: fakeParent,
    };

    // Swap in a stub that only intercepts the cleanup's selector
    document.querySelector = sel => {
      if (sel === '.custom-classname h3') {
        return fakeH3;
      }
      return originalQS.call(document, sel);
    };

    try {
      // Trigger cleanup
      unmount();
    } finally {
      // Always restore
      document.querySelector = originalQS;
    }

    // Assert our fake parent was asked to replace the H3 with an H2
    const didSwap = replaceCalls.some(
      ({ newNode, oldNode }) =>
        oldNode === fakeH3 && newNode && newNode.tagName === 'H2',
    );

    expect(didSwap, 'expected cleanup to replace an H3 with an H2').to.be.true;
  });
});
