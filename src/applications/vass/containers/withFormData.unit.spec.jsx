import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import withFormData from './withFormData';
import { URLS } from '../utils/constants';
import * as formSlice from '../redux/slices/formSlice';
import {
  getDefaultRenderOptions,
  getHydratedFormRenderOptions,
  LocationDisplay,
  TestComponent,
} from '../utils/test-utils';

describe('VASS Containers: withFormData', () => {
  let loadFormDataFromStorageStub;

  beforeEach(() => {
    loadFormDataFromStorageStub = sinon.stub(
      formSlice,
      'loadFormDataFromStorage',
    );
    loadFormDataFromStorageStub.returns(null);
  });

  afterEach(() => {
    loadFormDataFromStorageStub.restore();
  });

  describe('with no required fields', () => {
    it('should render the wrapped', () => {
      const WrappedComponent = withFormData(TestComponent, []);

      const { getByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ hydrated: true }),
      );

      expect(getByTestId('test-component')).to.exist;
    });
  });

  describe('when all required fields are present', () => {
    it('should render the wrapped component', () => {
      const WrappedComponent = withFormData(TestComponent, [
        'uuid',
        'lastname',
        'dob',
      ]);

      const { getByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({
          hydrated: true,
          uuid: 'test-uuid',
          lastname: 'Smith',
          dob: '1990-01-01',
        }),
      );

      expect(getByTestId('test-component')).to.exist;
    });

    it('should render when selectedTopics has at least one topic', () => {
      const WrappedComponent = withFormData(TestComponent, ['selectedTopics']);

      const { getByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({
          hydrated: true,
          selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
        }),
      );

      expect(getByTestId('test-component')).to.exist;
    });
  });

  describe('when required fields are missing', () => {
    it('should not render the component', () => {
      const WrappedComponent = withFormData(TestComponent, ['uuid']);

      const { queryByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ hydrated: true, uuid: null }),
      );

      expect(queryByTestId('test-component')).to.not.exist;
    });

    it('should not render when selectedTopics is empty', () => {
      const WrappedComponent = withFormData(TestComponent, ['selectedTopics']);

      const { queryByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({
          hydrated: true,
          selectedTopics: [],
        }),
      );

      expect(queryByTestId('test-component')).to.not.exist;
    });

    it('should redirect to route that sets missing field (uuid)', async () => {
      const WrappedComponent = withFormData(TestComponent, ['uuid']);

      const { getByTestId, queryByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path="/test" element={<WrappedComponent />} />
            <Route
              path={URLS.VERIFY}
              element={<div data-testid="verify-page">Verify</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...getDefaultRenderOptions({
            hydrated: true,
            uuid: null,
          }),
          initialEntries: ['/test'],
        },
      );

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          URLS.VERIFY,
        );
      });

      expect(queryByTestId('test-component')).to.not.exist;
    });

    it('should redirect to route that sets missing field (selectedDate)', async () => {
      const WrappedComponent = withFormData(TestComponent, ['selectedDate']);

      const { getByTestId, queryByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path="/test" element={<WrappedComponent />} />
            <Route
              path={URLS.DATE_TIME}
              element={<div data-testid="date-time-page">Date Time</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...getDefaultRenderOptions({
            hydrated: true,
            selectedDate: null,
          }),
          initialEntries: ['/test'],
        },
      );

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          URLS.DATE_TIME,
        );
      });

      expect(queryByTestId('test-component')).to.not.exist;
    });

    it('should redirect to route that sets missing field (selectedTopics)', async () => {
      const WrappedComponent = withFormData(TestComponent, ['selectedTopics']);

      const { getByTestId, queryByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path="/test" element={<WrappedComponent />} />
            <Route
              path={URLS.TOPIC_SELECTION}
              element={<div data-testid="topic-page">Topic Selection</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...getDefaultRenderOptions({
            hydrated: true,
            selectedTopics: [],
          }),
          initialEntries: ['/test'],
        },
      );

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          URLS.TOPIC_SELECTION,
        );
      });

      expect(queryByTestId('test-component')).to.not.exist;
    });

    it('should redirect based on first missing field when multiple are missing', async () => {
      const WrappedComponent = withFormData(TestComponent, [
        'uuid',
        'selectedDate',
      ]);

      const { getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path="/test" element={<WrappedComponent />} />
            <Route
              path={URLS.VERIFY}
              element={<div data-testid="verify-page">Verify</div>}
            />
            <Route
              path={URLS.DATE_TIME}
              element={<div data-testid="date-time-page">Date Time</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...getDefaultRenderOptions({
            hydrated: true,
            uuid: null,
            selectedDate: null,
          }),
          initialEntries: ['/test'],
        },
      );

      // Should redirect to Verify (first missing field is uuid)
      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          URLS.VERIFY,
        );
      });
    });
  });

  describe('hydration behavior', () => {
    it('should attempt to hydrate from sessionStorage when not hydrated and data is missing', async () => {
      const savedData = {
        uuid: 'saved-uuid',
        lastname: 'SavedName',
        dob: '1990-01-01',
      };
      loadFormDataFromStorageStub.returns(savedData);

      const WrappedComponent = withFormData(TestComponent, ['uuid']);

      const { getByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ hydrated: false, uuid: null }),
      );

      await waitFor(() => {
        expect(loadFormDataFromStorageStub.calledOnce).to.be.true;
      });

      await waitFor(() => {
        expect(getByTestId('test-component')).to.exist;
      });
    });

    it('should not attempt to hydrate when already hydrated', async () => {
      const WrappedComponent = withFormData(TestComponent, ['uuid']);

      renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ hydrated: true, uuid: 'existing-uuid' }),
      );

      await waitFor(() => {
        expect(loadFormDataFromStorageStub.called).to.be.false;
      });
    });

    it('should not attempt to hydrate when all required data is present', async () => {
      const WrappedComponent = withFormData(TestComponent, ['uuid']);

      renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ hydrated: false, uuid: 'existing-uuid' }),
      );

      await waitFor(() => {
        expect(loadFormDataFromStorageStub.called).to.be.false;
      });
    });

    it('should not render while hydrating', () => {
      const WrappedComponent = withFormData(TestComponent, ['uuid']);

      const { queryByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ hydrated: false, uuid: null }),
      );

      // Initially should not render while hydrating
      expect(queryByTestId('test-component')).to.not.exist;
    });
  });

  describe('clearFormData behavior', () => {
    it('should dispatch clearFormData when redirecting to Verify route', async () => {
      const WrappedComponent = withFormData(TestComponent, ['uuid']);

      // Set uuid to null to reroute to Verify page
      const defaultOptions = getHydratedFormRenderOptions({
        uuid: null,
      });

      const { getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path="/test" element={<WrappedComponent />} />
            <Route
              path={URLS.VERIFY}
              element={<div data-testid="verify-page">Verify</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultOptions,
          initialEntries: ['/test'],
        },
      );

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          URLS.VERIFY,
        );
      });

      const state = defaultOptions.store.getState();
      expect(state.vassForm.selectedDate).to.be.null;
      expect(state.vassForm.selectedTopics).to.deep.equal([]);
    });

    it('should not clear form data when redirecting to non-Verify routes', async () => {
      const WrappedComponent = withFormData(TestComponent, ['selectedDate']);

      // Set selectedDate to reroute to Date Time page
      const defaultOptions = getHydratedFormRenderOptions({
        selectedDate: null,
      });

      const { getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path="/test" element={<WrappedComponent />} />
            <Route
              path={URLS.DATE_TIME}
              element={<div data-testid="date-time-page">Date Time</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultOptions,
          initialEntries: ['/test'],
        },
      );

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          URLS.DATE_TIME,
        );
      });

      const state = defaultOptions.store.getState();
      // Form data should NOT be cleared when redirecting to non-Verify routes
      expect(state.vassForm.uuid).to.equal('test-uuid');
    });
  });
});
