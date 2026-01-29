import React from 'react';
import { expect } from 'chai';
import { addDays, addMinutes, subDays, format } from 'date-fns';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import Wrapper from './Wrapper';
import { getDefaultRenderOptions } from '../utils/test-utils';

const defaultRenderOptions = getDefaultRenderOptions();

describe('VASS Component: Wrapper', () => {
  it('should render children content', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper>
        <div data-testid="test-child">Test Content</div>
      </Wrapper>,
      defaultRenderOptions,
    );

    expect(screen.getByTestId('test-child')).to.exist;
  });

  it('should render page title when provided', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper pageTitle="Test Page Title">
        <div>Content</div>
      </Wrapper>,
      defaultRenderOptions,
    );

    expect(screen.getByRole('heading', { level: 1, name: /test page title/i }))
      .to.exist;
    expect(screen.getByTestId('header')).to.exist;
    expect(screen.getByTestId('header')).to.have.attribute('tabIndex', '-1');
  });

  it('should not render h1 when pageTitle is not provided', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper>
        <div>Content</div>
      </Wrapper>,
      defaultRenderOptions,
    );

    expect(screen.queryByTestId('header')).to.not.exist;
  });

  it('should render NeedHelp component', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper>
        <div>Content</div>
      </Wrapper>,
      defaultRenderOptions,
    );

    expect(screen.getByTestId('help-footer')).to.exist;
  });

  it('should apply custom className to container', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper className="custom-class" testID="wrapper-container">
        <div>Content</div>
      </Wrapper>,
      defaultRenderOptions,
    );

    const container = screen.getByTestId('wrapper-container'); // The default testID
    expect(container).to.exist;
    expect(container).to.have.class('custom-class');
    expect(container).to.have.class('vads-l-grid-container');
    expect(container).to.have.class('vads-u-padding-y--3');
  });

  it('should apply testID to container', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper testID="test-wrapper">
        <div>Content</div>
      </Wrapper>,
      defaultRenderOptions,
    );

    expect(screen.getByTestId('test-wrapper')).to.exist;
  });

  it('should render back button when showBackLink is true', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper showBackLink>
        <div>Content</div>
      </Wrapper>,
      defaultRenderOptions,
    );

    expect(screen.getByTestId('back-link')).to.exist;
  });

  it('should display *Required text when required prop is passed with pageTitle', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper showBackLink required pageTitle="Test Page Title">
        <div>Content</div>
      </Wrapper>,
      defaultRenderOptions,
    );

    const header = screen.getByTestId('header');
    expect(header.textContent).to.include('(*Required)');
  });

  it('should not display *Required text when required is not passed', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper showBackLink>
        <div>Content</div>
      </Wrapper>,
      defaultRenderOptions,
    );

    expect(screen.queryByText(/\(\*Required\)/)).to.not.exist;
  });

  describe('when verificationError is provided', () => {
    it('should render verification error alert', () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <Wrapper verificationError="Test Verification Error">
          <div>Content</div>
        </Wrapper>,
        defaultRenderOptions,
      );
      expect(getByTestId('verification-error-alert')).to.exist;
      expect(getByTestId('verification-error-alert')).to.have.text(
        'Test Verification Error',
      );
    });
    it('should not render children content', () => {
      const { queryByTestId } = renderWithStoreAndRouter(
        <Wrapper verificationError="Test Verification Error">
          <div data-testid="child-content">Content</div>
        </Wrapper>,
        defaultRenderOptions,
      );
      expect(queryByTestId('child-content')).to.not.exist;
    });
  });

  describe('when loading prop is true', () => {
    it('should render loading indicator', () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <Wrapper loading>
          <div>Content</div>
        </Wrapper>,
        defaultRenderOptions,
      );
      expect(getByTestId('loading-indicator')).to.exist;
      expect(getByTestId('loading-indicator')).to.have.attribute(
        'message',
        'Loading...',
      );
    });
    it('should render loading message when provided', () => {
      const { getByTestId } = renderWithStoreAndRouter(
        <Wrapper loading loadingMessage="Loading Message">
          <div>Content</div>
        </Wrapper>,
        defaultRenderOptions,
      );
      expect(getByTestId('loading-indicator')).to.have.attribute(
        'message',
        'Loading Message',
      );
    });
  });

  describe('when loading prop is false', () => {
    it('should not render loading indicator', () => {
      const { queryByTestId } = renderWithStoreAndRouter(
        <Wrapper loading={false}>
          <div>Content</div>
        </Wrapper>,
        defaultRenderOptions,
      );
      expect(queryByTestId('loading-indicator')).to.not.exist;
    });
  });

  describe('maintenance window', () => {
    it('should render maintenance message when service is down', () => {
      const serviceMap = createServiceMap([
        {
          attributes: {
            externalService: 'vass',
            status: 'down',
            startTime: format(subDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
            endTime: format(addDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
          },
        },
      ]);

      const screen = renderWithStoreAndRouter(
        <Wrapper>
          <div data-testid="child-content">Child content</div>
        </Wrapper>,
        {
          ...defaultRenderOptions,
          initialState: {
            ...defaultRenderOptions.initialState,
            scheduledDowntime: {
              globalDowntime: null,
              isReady: true,
              isPending: false,
              serviceMap,
              dismissedDowntimeWarnings: [],
            },
          },
        },
      );

      expect(screen.queryByText(/down for maintenance/)).to.exist;
      expect(screen.queryByTestId('child-content')).to.not.exist;
    });

    it('should render maintenance approaching message', () => {
      // startTime 30 minutes from now triggers "downtimeApproaching" status
      const serviceMap = createServiceMap([
        {
          attributes: {
            externalService: 'vass',
            startTime: format(
              addMinutes(new Date(), 30),
              "yyyy-MM-dd'T'HH:mm:ss",
            ),
            endTime: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
          },
        },
      ]);

      const screen = renderWithStoreAndRouter(
        <Wrapper>
          <div data-testid="child-content">Child content</div>
        </Wrapper>,
        {
          ...defaultRenderOptions,
          initialState: {
            ...defaultRenderOptions.initialState,
            scheduledDowntime: {
              globalDowntime: null,
              isReady: true,
              isPending: false,
              serviceMap,
              dismissedDowntimeWarnings: [],
            },
          },
        },
      );

      // The modal element uses id attribute, not data-testid
      const modal = screen.container.querySelector(
        '#downtime-approaching-modal',
      );
      expect(modal).to.exist;
      expect(screen.getByTestId('child-content')).to.exist;
      expect(modal.getAttribute('secondary-button-text')).to.eq('Dismiss');
    });

    it('should render default maintenance message without description', () => {
      const serviceMap = createServiceMap([
        {
          attributes: {
            externalService: 'vass',
            status: 'down',
            startTime: format(subDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
            endTime: format(addDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
          },
        },
      ]);

      const screen = renderWithStoreAndRouter(
        <Wrapper>
          <div data-testid="child-content">Child content</div>
        </Wrapper>,
        {
          ...defaultRenderOptions,
          initialState: {
            ...defaultRenderOptions.initialState,
            scheduledDowntime: {
              globalDowntime: null,
              isReady: true,
              isPending: false,
              serviceMap,
              dismissedDowntimeWarnings: [],
            },
          },
        },
      );

      expect(screen.queryByText(/down for maintenance/)).to.exist;
      expect(screen.queryByTestId('child-content')).to.not.exist;
    });

    it('should render children when no maintenance window is active', () => {
      const screen = renderWithStoreAndRouter(
        <Wrapper>
          <div data-testid="child-content">Child content</div>
        </Wrapper>,
        defaultRenderOptions,
      );

      expect(screen.getByTestId('child-content')).to.exist;
      expect(screen.queryByText(/down for maintenance/)).to.not.exist;
    });
  });
});
