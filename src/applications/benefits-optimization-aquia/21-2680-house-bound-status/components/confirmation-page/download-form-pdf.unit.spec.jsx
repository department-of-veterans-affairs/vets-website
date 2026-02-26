import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { DownloadFormPDF } from './download-form-pdf';
import * as pdfUtils from '../../utils/pdfDownload';

// The component dispatches `toggleLoginModal`, which is a thunk. Keep tests
// dependency-light by using a local thunk middleware instead of bringing in a
// full mocked store implementation.
const thunkMiddleware = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  return next(action);
};

// Minimal reducer that supports updating login status
const userReducer = (
  state = { login: { currentlyLoggedIn: true } },
  action,
) => {
  if (action.type === 'UPDATE_LOGGEDIN_STATUS') {
    return {
      ...state,
      login: { ...state.login, currentlyLoggedIn: action.value },
    };
  }
  return state;
};

// Capture dispatched actions for assertion
const navigationReducer = (state = { showLoginModal: false }, action) => {
  if (action.type === 'TOGGLE_LOGIN_MODAL') {
    return { ...state, showLoginModal: action.isOpen };
  }
  return state;
};

// `toggleLoginModal` reads feature flags from state, so tests need this slice
// to mirror production shape and avoid false negatives.
const featureTogglesReducer = (
  state = { loading: false, cernerNonEligibleSisEnabled: false },
) => state;

const rootReducer = combineReducers({
  user: userReducer,
  navigation: navigationReducer,
  featureToggles: featureTogglesReducer,
});

const renderWithStore = (ui, { loggedIn = true } = {}) => {
  const store = createStore(
    rootReducer,
    {
      user: { login: { currentlyLoggedIn: loggedIn } },
      navigation: { showLoginModal: false },
      featureToggles: { loading: false, cernerNonEligibleSisEnabled: false },
    },
    applyMiddleware(thunkMiddleware),
  );
  const utils = render(<Provider store={store}>{ui}</Provider>);
  return { ...utils, store };
};

describe('DownloadFormPDF', () => {
  let fetchPdfApiStub;
  let downloadBlobStub;

  const mockGuid = '12345678-1234-1234-1234-123456789abc';

  const mockVeteranName = {
    first: 'John',
    middle: 'M',
    last: 'Smith',
  };

  beforeEach(() => {
    fetchPdfApiStub = sinon.stub(pdfUtils, 'fetchPdfApi');
    downloadBlobStub = sinon.stub(pdfUtils, 'downloadBlob');

    const mockBlob = new Blob(['mock pdf content'], {
      type: 'application/pdf',
    });
    fetchPdfApiStub.resolves(mockBlob);
  });

  afterEach(() => {
    fetchPdfApiStub.restore();
    downloadBlobStub.restore();
    cleanup();
  });

  it('should render the download link', () => {
    const { container } = renderWithStore(
      <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
    );

    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      'Download a copy of your VA Form 21-2680 (PDF)',
    );
  });

  it('should show loading state when downloading', async () => {
    fetchPdfApiStub.returns(
      new Promise(resolve => {
        setTimeout(() => resolve(new Blob()), 100);
      }),
    );

    const { container } = renderWithStore(
      <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    await waitFor(() => {
      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Downloading your completed form...',
      );
    });
  });

  it('should download the PDF when link is clicked', async () => {
    const { container } = renderWithStore(
      <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    await waitFor(() => {
      expect(fetchPdfApiStub.calledOnce).to.be.true;
      expect(fetchPdfApiStub.calledWith(mockGuid)).to.be.true;
      expect(downloadBlobStub.calledOnce).to.be.true;
      expect(downloadBlobStub.getCall(0).args[1]).to.equal(
        '21-2680_John_Smith.pdf',
      );
    });
  });

  it('should show error message when download fails', async () => {
    fetchPdfApiStub.rejects(new Error('API Error'));

    const { container, getByText, getByRole } = renderWithStore(
      <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    await waitFor(() => {
      const alert = getByRole('alert');
      expect(alert).to.exist;
      expect(getByText('Download failed')).to.exist;
      expect(
        getByText(
          "We're sorry. Something went wrong when downloading your form. Please try again later.",
        ),
      ).to.exist;
    });
  });

  it('should show try again button after error', async () => {
    fetchPdfApiStub.rejects(new Error('API Error'));

    const { container } = renderWithStore(
      <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    await waitFor(() => {
      const retryButton = container.querySelector(
        'va-alert va-button[text="Try again"]',
      );
      expect(retryButton).to.exist;
    });

    // Reset stub to succeed
    fetchPdfApiStub.reset();
    const mockBlob = new Blob(['mock pdf content'], {
      type: 'application/pdf',
    });
    fetchPdfApiStub.resolves(mockBlob);

    const tryAgainButton = container.querySelector(
      'va-alert va-button[text="Try again"]',
    );
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(fetchPdfApiStub.calledOnce).to.be.true;
      expect(downloadBlobStub.called).to.be.true;
    });
  });

  it('should show error when submission ID is missing', async () => {
    const { container, getByText } = renderWithStore(
      <DownloadFormPDF guid="" veteranName={mockVeteranName} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    await waitFor(() => {
      expect(
        getByText('No submission ID available. Please submit the form first.'),
      ).to.exist;
      expect(fetchPdfApiStub.called).to.be.false;
    });
  });

  it('should use default veteran name when not provided', async () => {
    const { container } = renderWithStore(<DownloadFormPDF guid={mockGuid} />);

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    await waitFor(() => {
      expect(downloadBlobStub.getCall(0).args[1]).to.equal(
        '21-2680_Veteran_Submission.pdf',
      );
    });
  });

  it('should format filename correctly with special characters', async () => {
    const specialNameVeteran = {
      first: "Mary-Jane's",
      middle: 'K',
      last: 'O-Brien',
    };

    const { container } = renderWithStore(
      <DownloadFormPDF guid={mockGuid} veteranName={specialNameVeteran} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    await waitFor(() => {
      expect(downloadBlobStub.calledOnce).to.be.true;
      expect(downloadBlobStub.getCall(0).args[1]).to.equal(
        '21-2680_MaryJanes_OBrien.pdf',
      );
    });
  });

  // --- Proactive session expiration path ---

  describe('proactive session expiration (isLoggedIn = false)', () => {
    it('should show session expired alert instead of calling the API', async () => {
      const { container, getByText } = renderWithStore(
        <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
        { loggedIn: false },
      );

      const link = container.querySelector('va-link');
      fireEvent.click(link);

      await waitFor(() => {
        expect(getByText('Your session has expired')).to.exist;
        expect(fetchPdfApiStub.called).to.be.false;
      });
    });

    it('should show Sign in button when session is expired', async () => {
      const { container } = renderWithStore(
        <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
        { loggedIn: false },
      );

      const link = container.querySelector('va-link');
      fireEvent.click(link);

      await waitFor(() => {
        const signInButton = container.querySelector(
          'va-button[text="Sign in"]',
        );
        expect(signInButton).to.exist;
      });
    });

    it('should dispatch toggleLoginModal when Sign in is clicked', async () => {
      const { container, store } = renderWithStore(
        <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
        { loggedIn: false },
      );

      const link = container.querySelector('va-link');
      fireEvent.click(link);

      await waitFor(() => {
        const signInButton = container.querySelector(
          'va-button[text="Sign in"]',
        );
        expect(signInButton).to.exist;
      });

      const signInButton = container.querySelector('va-button[text="Sign in"]');
      fireEvent.click(signInButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.navigation.showLoginModal).to.be.true;
      });
    });
  });

  // --- Reactive 401 session expiration path ---

  describe('reactive 401 session expiration', () => {
    it('should show session expired alert when API returns 401', async () => {
      const sessionError = new Error('Session expired');
      sessionError.sessionExpired = true;
      fetchPdfApiStub.rejects(sessionError);

      const { container, getByText } = renderWithStore(
        <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
        { loggedIn: true },
      );

      const link = container.querySelector('va-link');
      fireEvent.click(link);

      await waitFor(() => {
        expect(getByText('Your session has expired')).to.exist;
        expect(fetchPdfApiStub.calledOnce).to.be.true;
      });
    });

    it('should show Sign in button after 401, not the generic error', async () => {
      const sessionError = new Error('Session expired');
      sessionError.sessionExpired = true;
      fetchPdfApiStub.rejects(sessionError);

      const { container, queryByText } = renderWithStore(
        <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
        { loggedIn: true },
      );

      const link = container.querySelector('va-link');
      fireEvent.click(link);

      await waitFor(() => {
        const signInButton = container.querySelector(
          'va-button[text="Sign in"]',
        );
        expect(signInButton).to.exist;
        expect(queryByText('Download failed')).to.not.exist;
      });
    });
  });

  // --- Recovery: session restored after expiration ---

  describe('session recovery after re-login', () => {
    it('should clear session expired state and show download link when isLoggedIn becomes true', async () => {
      const { container, getByText, store } = renderWithStore(
        <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
        { loggedIn: false },
      );

      // Trigger the proactive session expired state
      const link = container.querySelector('va-link');
      fireEvent.click(link);

      await waitFor(() => {
        expect(getByText('Your session has expired')).to.exist;
      });

      // Simulate user signing back in
      store.dispatch({ type: 'UPDATE_LOGGEDIN_STATUS', value: true });

      // Session expired alert should clear and download link should reappear
      await waitFor(() => {
        const downloadLink = container.querySelector('va-link');
        expect(downloadLink).to.exist;
        expect(downloadLink.getAttribute('text')).to.equal(
          'Download a copy of your VA Form 21-2680 (PDF)',
        );
      });
    });
  });
});
