import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import * as redux from 'react-redux';
import { useURLPagination } from '../../hooks/useURLPagination';

function renderHook(renderCallback, options = {}) {
  const { initialProps, ...renderOptions } = options;
  const result = React.createRef();
  result.current = null;

  function TestComponent({ renderCallbackProps }) {
    const hookResult = renderCallback(renderCallbackProps);
    result.current = hookResult;

    React.useEffect(() => {
      result.current = hookResult;
    });

    return null;
  }

  const { rerender: baseRerender, unmount } = render(
    <TestComponent renderCallbackProps={initialProps} />,
    renderOptions,
  );

  function rerender(rerenderCallbackProps) {
    return baseRerender(
      <TestComponent renderCallbackProps={rerenderCallbackProps} />,
    );
  }

  return { result, rerender, unmount };
}

/**
 * Creates a test wrapper with Redux Provider and MemoryRouter
 * @param {Object} mockStore the mock Redux store
 * @param {number} page The page number to include as the initialEntries 'page' query parameter
 * @returns {React.Component} A React component wrapping children with Provider and MemoryRouter
 */
function createTestWrapper(mockStore, page = 1) {
  const Wrapper = ({ children }) => (
    <Provider store={mockStore}>
      <MemoryRouter initialEntries={[page !== null ? `/?page=${page}` : '']}>
        {children}
      </MemoryRouter>
    </Provider>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return Wrapper;
}

describe('useURLPagination', () => {
  let sandbox;
  let mockStore;
  let wrapper;
  let dispatchSpy;
  let navigateStub;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    mockStore = configureStore([])({ rx: { preferences: { pageNumber: 1 } } });
    dispatchSpy = sandbox.spy();
    navigateStub = sandbox.stub();

    sandbox.stub(redux, 'useDispatch').returns(dispatchSpy);

    wrapper = createTestWrapper(mockStore);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns currentPage and handlePageChange', async () => {
    wrapper = createTestWrapper(mockStore);

    const { result } = renderHook(() => useURLPagination(), {
      wrapper,
    });
    expect(result.current.currentPage).to.equal(1);
    expect(result.current.handlePageChange).to.be.a('function');
  });

  it('No action is dispatched for invalid page number (negative)', async () => {
    wrapper = createTestWrapper(mockStore, -4);

    renderHook(
      () =>
        useURLPagination({
          navigate: navigateStub,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.false;
      expect(navigateStub.calledWith('/?page=1', { replace: true })).to.be.true;
    });
  });

  it("Redirects to page 1 and doesn't dispatch an action when the page query param is missing", async () => {
    wrapper = createTestWrapper(mockStore, null);

    renderHook(
      () =>
        useURLPagination({
          navigate: navigateStub,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.false;
      expect(navigateStub.calledWith('/?page=1', { replace: true })).to.be.true;
    });
  });

  it('Dispatches action when the page query param is different from the current page number in state', async () => {
    mockStore = configureStore([])({ rx: { preferences: { pageNumber: 5 } } });
    wrapper = createTestWrapper(mockStore, 12);

    renderHook(() => useURLPagination({ navigate: navigateStub }), { wrapper });

    await waitFor(() => {
      expect(
        dispatchSpy.calledWith({
          type: 'preferences/setPageNumber',
          payload: 12,
        }),
      ).to.be.true;
      expect(navigateStub.called).to.be.false;
    });
  });

  it('No action is dispatched for invalid page number (NaN)', async () => {
    wrapper = createTestWrapper(mockStore, 'invalid');

    renderHook(() => useURLPagination({ navigate: navigateStub }), { wrapper });

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.false;
      expect(navigateStub.calledWith('/?page=1', { replace: true })).to.be.true;
    });
  });

  it('dispatches correct action if pageNumber !== page number in state', async () => {
    mockStore = configureStore([])({ rx: { preferences: { pageNumber: 5 } } });
    wrapper = createTestWrapper(mockStore);
    renderHook(() => useURLPagination({ navigate: navigateStub }), { wrapper });
    await waitFor(() => {
      expect(dispatchSpy.called).to.be.true;
      expect(navigateStub.called).to.be.false;
    });
  });

  it('handlePageChange dispatches correct action', async () => {
    const { result } = renderHook(
      () => useURLPagination({ navigate: navigateStub }),
      { wrapper },
    );
    result.current.handlePageChange(2);

    await waitFor(() => {
      expect(
        dispatchSpy.calledWith({
          type: 'preferences/setPageNumber',
          payload: 2,
        }),
      ).to.be.true;
      expect(navigateStub.calledWith('/?page=2', { replace: true })).to.be.true;
    });
  });

  it('handlePageChange does not dispatch an action or redirect for invalid page number (negative)', async () => {
    const { result } = renderHook(
      () => useURLPagination({ navigate: navigateStub }),
      { wrapper },
    );
    result.current.handlePageChange(0);

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.false;
      expect(navigateStub.called).to.be.false;
    });
  });

  it('handlePageChange does not dispatch an action or redirect for invalid page number (NaN)', async () => {
    const { result } = renderHook(
      () => useURLPagination({ navigate: navigateStub }),
      { wrapper },
    );
    result.current.handlePageChange(Number.NaN);

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.false;
      expect(navigateStub.called).to.be.false;
    });
  });
});
