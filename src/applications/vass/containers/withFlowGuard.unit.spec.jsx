import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import withFlowGuard from './withFlowGuard';
import { FLOW_TYPES, URLS } from '../utils/constants';
import {
  getDefaultRenderOptions,
  LocationDisplay,
  TestComponent,
} from '../utils/test-utils';

describe('VASS Containers: withFlowGuard', () => {
  describe('with FLOW_TYPES.ANY (default)', () => {
    it('should render the wrapped component regardless of flow type', () => {
      const WrappedComponent = withFlowGuard(TestComponent, FLOW_TYPES.ANY);

      const { getByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ flowType: FLOW_TYPES.SCHEDULE }),
      );

      expect(getByTestId('test-component')).to.exist;
    });

    it('should render when flow type is cancel', () => {
      const WrappedComponent = withFlowGuard(TestComponent, FLOW_TYPES.ANY);

      const { getByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ flowType: FLOW_TYPES.CANCEL }),
      );

      expect(getByTestId('test-component')).to.exist;
    });

    it('should render when flow type is not set', () => {
      const WrappedComponent = withFlowGuard(TestComponent, FLOW_TYPES.ANY);

      const { getByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ flowType: null }),
      );

      expect(getByTestId('test-component')).to.exist;
    });
  });

  describe('with FLOW_TYPES.SCHEDULE', () => {
    describe('when user is in schedule flow', () => {
      it('should render the wrapped component', () => {
        const WrappedComponent = withFlowGuard(
          TestComponent,
          FLOW_TYPES.SCHEDULE,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ flowType: FLOW_TYPES.SCHEDULE }),
        );

        expect(getByTestId('test-component')).to.exist;
      });
    });

    describe('when user is in cancel flow', () => {
      it('should not render the component', () => {
        const WrappedComponent = withFlowGuard(
          TestComponent,
          FLOW_TYPES.SCHEDULE,
        );

        const { queryByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ flowType: FLOW_TYPES.CANCEL }),
        );

        expect(queryByTestId('test-component')).to.not.exist;
      });

      it('should redirect to Verify page with uuid and cancel param', async () => {
        const WrappedComponent = withFlowGuard(
          TestComponent,
          FLOW_TYPES.SCHEDULE,
        );

        const { getByTestId, queryByTestId } = renderWithStoreAndRouterV6(
          <>
            <Routes>
              <Route path="/schedule-route" element={<WrappedComponent />} />
              <Route
                path="/"
                element={<div data-testid="verify-page">Verify</div>}
              />
            </Routes>
            <LocationDisplay />
          </>,
          {
            ...getDefaultRenderOptions({
              flowType: FLOW_TYPES.CANCEL,
              uuid: 'test-uuid-1234',
            }),
            initialEntries: ['/schedule-route'],
          },
        );

        await waitFor(() => {
          expect(getByTestId('location-display').textContent).to.equal(
            `${URLS.VERIFY}?uuid=test-uuid-1234&cancel=true`,
          );
        });

        expect(queryByTestId('test-component')).to.not.exist;
      });

      it('should redirect to Verify page with cancel param when uuid is not set', async () => {
        const WrappedComponent = withFlowGuard(
          TestComponent,
          FLOW_TYPES.SCHEDULE,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <>
            <Routes>
              <Route path="/schedule-route" element={<WrappedComponent />} />
              <Route
                path="/"
                element={<div data-testid="verify-page">Verify</div>}
              />
            </Routes>
            <LocationDisplay />
          </>,
          {
            ...getDefaultRenderOptions({
              flowType: FLOW_TYPES.CANCEL,
              uuid: null,
            }),
            initialEntries: ['/schedule-route'],
          },
        );

        await waitFor(() => {
          expect(getByTestId('location-display').textContent).to.equal(
            `${URLS.VERIFY}?cancel=true`,
          );
        });
      });
    });

    describe('when flow type is not set yet', () => {
      it('should render the component when flowType is null', () => {
        const WrappedComponent = withFlowGuard(
          TestComponent,
          FLOW_TYPES.SCHEDULE,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ flowType: null }),
        );

        expect(getByTestId('test-component')).to.exist;
      });

      it('should render the component when flowType is ANY', () => {
        const WrappedComponent = withFlowGuard(
          TestComponent,
          FLOW_TYPES.SCHEDULE,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ flowType: FLOW_TYPES.ANY }),
        );

        expect(getByTestId('test-component')).to.exist;
      });
    });
  });

  describe('with FLOW_TYPES.CANCEL', () => {
    describe('when user is in cancel flow', () => {
      it('should render the wrapped component', () => {
        const WrappedComponent = withFlowGuard(
          TestComponent,
          FLOW_TYPES.CANCEL,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ flowType: FLOW_TYPES.CANCEL }),
        );

        expect(getByTestId('test-component')).to.exist;
      });
    });

    describe('when user is in schedule flow', () => {
      it('should not render the component', () => {
        const WrappedComponent = withFlowGuard(
          TestComponent,
          FLOW_TYPES.CANCEL,
        );

        const { queryByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ flowType: FLOW_TYPES.SCHEDULE }),
        );

        expect(queryByTestId('test-component')).to.not.exist;
      });

      it('should redirect to Verify page with uuid', async () => {
        const WrappedComponent = withFlowGuard(
          TestComponent,
          FLOW_TYPES.CANCEL,
        );

        const { getByTestId, queryByTestId } = renderWithStoreAndRouterV6(
          <>
            <Routes>
              <Route path="/cancel-route" element={<WrappedComponent />} />
              <Route
                path="/"
                element={<div data-testid="verify-page">Verify</div>}
              />
            </Routes>
            <LocationDisplay />
          </>,
          {
            ...getDefaultRenderOptions({
              flowType: FLOW_TYPES.SCHEDULE,
              uuid: 'test-uuid-5678',
            }),
            initialEntries: ['/cancel-route'],
          },
        );

        await waitFor(() => {
          expect(getByTestId('location-display').textContent).to.equal(
            `${URLS.VERIFY}?uuid=test-uuid-5678`,
          );
        });

        expect(queryByTestId('test-component')).to.not.exist;
      });
    });

    describe('when flow type is not set yet', () => {
      it('should render the component when flowType is null', () => {
        const WrappedComponent = withFlowGuard(
          TestComponent,
          FLOW_TYPES.CANCEL,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ flowType: null }),
        );

        expect(getByTestId('test-component')).to.exist;
      });

      it('should render the component when flowType is ANY', () => {
        const WrappedComponent = withFlowGuard(
          TestComponent,
          FLOW_TYPES.CANCEL,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ flowType: FLOW_TYPES.ANY }),
        );

        expect(getByTestId('test-component')).to.exist;
      });
    });
  });

  describe('displayName', () => {
    it('should set displayName for debugging', () => {
      const NamedComponent = () => <div>Named</div>;
      NamedComponent.displayName = 'NamedComponent';

      const WrappedComponent = withFlowGuard(NamedComponent, FLOW_TYPES.ANY);

      expect(WrappedComponent.displayName).to.equal(
        'withFlowGuard(NamedComponent)',
      );
    });

    it('should use component name when displayName is not set', () => {
      const MyComponent = () => <div>My</div>;

      const WrappedComponent = withFlowGuard(MyComponent, FLOW_TYPES.ANY);

      expect(WrappedComponent.displayName).to.equal(
        'withFlowGuard(MyComponent)',
      );
    });
  });

  describe('default allowedFlow parameter', () => {
    it('should default to FLOW_TYPES.ANY when no allowedFlow is provided', () => {
      const WrappedComponent = withFlowGuard(TestComponent);

      // Should render regardless of flow type since default is ANY
      const { getByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ flowType: FLOW_TYPES.CANCEL }),
      );

      expect(getByTestId('test-component')).to.exist;
    });
  });
});
