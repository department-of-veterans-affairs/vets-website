import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { addDays, addHours, subHours } from 'date-fns';
import sinon from 'sinon';

import * as apiModule from 'platform/utilities/api';
import ArpMaintenanceWindowBanner from '../../../components/ArpMaintenanceWindowBanner';

describe('ArpMaintenanceWindowBanner', () => {
  let apiRequestStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub(apiModule, 'apiRequest').resolves({ data: [] });
  });

  afterEach(() => {
    if (apiRequestStub) {
      apiRequestStub.restore();
    }
  });

  describe('component rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<ArpMaintenanceWindowBanner />);
      expect(container).to.exist;
    });

    it('returns null when no maintenance windows are active', async () => {
      const { container } = render(<ArpMaintenanceWindowBanner />);
      await waitFor(() => {
        // Component should render nothing when there's no maintenance
        expect(container.textContent).to.equal('');
      });
    });

    it('renders when maintenance window is active', async () => {
      const now = new Date();
      const startTime = subHours(now, 1);
      const endTime = addHours(now, 2);

      apiRequestStub.restore();
      apiRequestStub = sinon.stub(apiModule, 'apiRequest').resolves({
        data: [
          {
            attributes: {
              externalService: 'global',
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            },
          },
        ],
      });

      const { container } = render(
        <ArpMaintenanceWindowBanner services={['global']} />,
      );

      await waitFor(() => {
        // Component should have content when maintenance is active
        expect(container.textContent.length).to.be.greaterThan(0);
      });
    });

    it('renders when maintenance is approaching', async () => {
      const now = new Date();
      const startTime = addHours(now, 6);
      const endTime = addHours(startTime, 2);

      apiRequestStub.restore();
      apiRequestStub = sinon.stub(apiModule, 'apiRequest').resolves({
        data: [
          {
            attributes: {
              externalService: 'global',
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            },
          },
        ],
      });

      const { container } = render(
        <ArpMaintenanceWindowBanner services={['global']} />,
      );

      await waitFor(() => {
        expect(container.textContent.length).to.be.greaterThan(0);
      });
    });

    it('returns null when maintenance is in far future', async () => {
      const now = new Date();
      const startTime = addDays(now, 6);
      const endTime = addHours(startTime, 2);

      apiRequestStub.restore();
      apiRequestStub = sinon.stub(apiModule, 'apiRequest').resolves({
        data: [
          {
            attributes: {
              externalService: 'global',
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            },
          },
        ],
      });

      const { container } = render(
        <ArpMaintenanceWindowBanner services={['global']} />,
      );

      await waitFor(() => {
        expect(container.textContent).to.equal('');
      });
    });
  });

  describe('service subscription', () => {
    it('filters maintenance windows by service', async () => {
      const now = new Date();
      const startTime = subHours(now, 1);
      const endTime = addHours(now, 2);

      apiRequestStub.resetBehavior();
      apiRequestStub.resolves({
        data: [
          {
            attributes: {
              externalService: 'vet360',
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            },
          },
        ],
      });

      const { container } = render(
        <ArpMaintenanceWindowBanner services={['vet360']} />,
      );

      await waitFor(() => {
        expect(container.textContent.length).to.be.greaterThan(0);
      });
    });

    it('ignores maintenance windows for unsubscribed services', async () => {
      const now = new Date();
      const startTime = subHours(now, 1);
      const endTime = addHours(now, 2);

      apiRequestStub.resetBehavior();
      apiRequestStub.resolves({
        data: [
          {
            attributes: {
              externalService: 'other-service',
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            },
          },
        ],
      });

      const { container } = render(
        <ArpMaintenanceWindowBanner services={['global']} />,
      );

      await waitFor(() => {
        // Should return null since service doesn't match
        expect(container.textContent).to.equal('');
      });
    });

    it('subscribes to multiple services', async () => {
      const now = new Date();
      const startTime = subHours(now, 1);
      const endTime = addHours(now, 2);

      apiRequestStub.resetBehavior();
      apiRequestStub.resolves({
        data: [
          {
            attributes: {
              externalService: 'vet360',
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            },
          },
        ],
      });

      const { container } = render(
        <ArpMaintenanceWindowBanner services={['global', 'vet360', 'idme']} />,
      );

      await waitFor(() => {
        expect(container.textContent.length).to.be.greaterThan(0);
      });
    });
  });

  describe('maintenance window timing', () => {
    it('hides banner when maintenance is too far in the future', async () => {
      const now = new Date();
      const startTime = addHours(now, 25);
      const endTime = addHours(startTime, 2);

      apiRequestStub.resetBehavior();
      apiRequestStub.resolves({
        data: [
          {
            attributes: {
              externalService: 'global',
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            },
          },
        ],
      });

      const { container } = render(
        <ArpMaintenanceWindowBanner services={['global']} />,
      );

      await waitFor(() => {
        expect(container.textContent).to.equal('');
      });
    });

    it('hides banner when maintenance has ended', async () => {
      const now = new Date();
      const startTime = subHours(now, 3);
      const endTime = subHours(now, 1);

      apiRequestStub.resetBehavior();
      apiRequestStub.resolves({
        data: [
          {
            attributes: {
              externalService: 'global',
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            },
          },
        ],
      });

      const { container } = render(
        <ArpMaintenanceWindowBanner services={['global']} />,
      );

      await waitFor(() => {
        expect(container.textContent).to.equal('');
      });
    });
  });

  describe('error handling', () => {
    it('handles fetch errors gracefully', async () => {
      apiRequestStub.resetBehavior();
      apiRequestStub.rejects(new Error('Network error'));

      const { container } = render(
        <ArpMaintenanceWindowBanner services={['global']} />,
      );

      await waitFor(() => {
        expect(container.textContent).to.equal('');
      });
    });

    it('handles malformed API response', async () => {
      apiRequestStub.resetBehavior();
      apiRequestStub.resolves(null);

      const { container } = render(
        <ArpMaintenanceWindowBanner services={['global']} />,
      );

      await waitFor(() => {
        expect(container.textContent).to.equal('');
      });
    });
  });

  describe('API interactions', () => {
    it('fetches maintenance windows on mount', async () => {
      render(<ArpMaintenanceWindowBanner />);

      await waitFor(() => {
        expect(apiRequestStub.called).to.be.true;
      });
    });

    it('uses correct API endpoint', async () => {
      render(<ArpMaintenanceWindowBanner />);

      await waitFor(() => {
        expect(apiRequestStub.calledWith('/maintenance_windows/')).to.be.true;
      });
    });
  });
});
