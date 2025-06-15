/* eslint-disable camelcase */

import { render } from '@testing-library/react';
import { expect } from 'chai';
import { EXTERNAL_SERVICES } from '../../../monitoring/external-services/config';
import * as downtimeUtils from '../../authentication/downtime';

const oneHourInMilliseconds = 3_600_000;

describe('generateCSPBanner', () => {
  downtimeUtils.CSP_DEPENDENCIES.forEach(csp => {
    it(`should return a correct banner message when csp is "${csp}"`, () => {
      const result = downtimeUtils.generateCSPBanner({
        csp,
      });
      expect(result).to.deep.equal(downtimeUtils.DOWNTIME_BANNER_CONFIG[csp]);
    });
  });

  it('should throw an error when csp is not provided', () => {
    expect(() => downtimeUtils.generateCSPBanner({})).to.throw(Error);
  });

  it('should throw an error when csp is an unexpected value', () => {
    expect(() =>
      downtimeUtils.generateCSPBanner({
        csp: 'unknownCSP',
      }),
    ).to.throw(Error);
  });
});

describe('renderServiceDown', () => {
  it('should render correct output for valid service string', () => {
    const { container } = render(
      downtimeUtils.renderServiceDown(EXTERNAL_SERVICES.ssoe),
    );
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal(
      downtimeUtils.DOWNTIME_BANNER_CONFIG.ssoe.status,
    );
    expect(alert.querySelector('h2').textContent).to.equal(
      downtimeUtils.DOWNTIME_BANNER_CONFIG.ssoe.headline,
    );
  });

  it('should render fallback output for invalid service string', () => {
    const { container } = render(
      downtimeUtils.renderServiceDown('unknownService'),
    );
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal(
      downtimeUtils.DOWNTIME_BANNER_CONFIG.mvi.status,
    );
    expect(alert.querySelector('h2').textContent).to.equal(
      downtimeUtils.DOWNTIME_BANNER_CONFIG.mvi.headline,
    );
  });

  it('should render correctly for non-string service parameter', () => {
    const customService = {
      status: 'info',
      headline: 'Custom headline',
      message: 'Custom message.',
    };
    const { container } = render(
      downtimeUtils.renderServiceDown(customService),
    );
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal(customService.status);
    expect(alert.querySelector('h2').textContent).to.equal(
      customService.headline,
    );
  });
});

describe('renderDowntimeBanner', () => {
  it('should render banner for multiple services down', () => {
    const statuses = [
      { serviceId: EXTERNAL_SERVICES.logingov, status: 'down' },
      { serviceId: EXTERNAL_SERVICES.idme, status: 'down' },
    ];
    const { container } = render(downtimeUtils.renderDowntimeBanner(statuses));
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal(
      downtimeUtils.DOWNTIME_BANNER_CONFIG.multipleServices.status,
    );
    expect(alert.querySelector('h2').textContent).to.equal(
      downtimeUtils.DOWNTIME_BANNER_CONFIG.multipleServices.headline,
    );
  });

  it('should render banner for a single service down', () => {
    const statuses = [
      { serviceId: EXTERNAL_SERVICES.logingov, status: 'down' },
    ];
    const { container } = render(downtimeUtils.renderDowntimeBanner(statuses));
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal(
      downtimeUtils.DOWNTIME_BANNER_CONFIG.logingov.status,
    );
    expect(alert.querySelector('h2').textContent).to.equal(
      downtimeUtils.DOWNTIME_BANNER_CONFIG.logingov.headline,
    );
  });

  it('should return null when no services are down', () => {
    const statuses = [
      { serviceId: EXTERNAL_SERVICES.logingov, status: 'active' },
    ];
    const result = downtimeUtils.renderDowntimeBanner(statuses);
    expect(result).to.be.null;
  });

  it('should return null when provided an empty status list', () => {
    const statuses = [];
    const result = downtimeUtils.renderDowntimeBanner(statuses);
    expect(result).to.be.null;
  });

  it('should no longer render banners for mhv downtime', () => {
    const statuses = [{ serviceId: EXTERNAL_SERVICES.mhv, status: 'down' }];
    const result = downtimeUtils.renderDowntimeBanner(statuses);
    expect(result).to.be.null;
  });

  it('should not allow mhv to contribute to rendering multiple services', () => {
    const statuses = [
      { serviceId: EXTERNAL_SERVICES.mhv, status: 'down' },
      { serviceId: EXTERNAL_SERVICES.logingov, status: 'down' },
    ];
    const { container } = render(downtimeUtils.renderDowntimeBanner(statuses));
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal(
      downtimeUtils.DOWNTIME_BANNER_CONFIG.logingov.status,
    );
    expect(alert.querySelector('h2').textContent).to.equal(
      downtimeUtils.DOWNTIME_BANNER_CONFIG.logingov.headline,
    );
  });
});

describe('createMaintenanceBanner', () => {
  it('should correctly construct a maintenance banner object', () => {
    const startTime = new Date().toISOString();
    const endTime = new Date(
      new Date().getTime() + 2 * oneHourInMilliseconds,
    ).toISOString(); // 2 hours later
    const banner = downtimeUtils.createMaintenanceBanner({
      startTime,
      endTime,
    });

    expect(banner).to.have.property('headline', 'Upcoming site maintenance');
    expect(banner).to.have.property('status', 'info');
    expect(banner)
      .to.have.property('message')
      .that.is.a('object');
    expect(banner)
      .to.have.property('startTime')
      .that.is.a('date');
    expect(banner)
      .to.have.property('endTime')
      .that.is.a('date');
  });
});

describe('determineMaintenance', () => {
  it('should find the first maintenance window that meets the criteria', () => {
    const maintArray = [
      { externalService: EXTERNAL_SERVICES.logingov },
      { externalService: EXTERNAL_SERVICES.global },
    ];
    const result = downtimeUtils.determineMaintenance(maintArray);
    expect(result).to.deep.equal({
      externalService: EXTERNAL_SERVICES.logingov,
    });
  });

  it('should return undefined if no maintenance window meets the criteria', () => {
    const maintArray = [{ externalService: 'otherService' }];
    const result = downtimeUtils.determineMaintenance(maintArray);
    expect(result).to.be.undefined;
  });
});

describe('isInMaintenanceWindow', () => {
  it('should return true when the current time is within the maintenance window', () => {
    const startTime = new Date(
      new Date().getTime() - oneHourInMilliseconds,
    ).toISOString(); // 1 hour ago
    const endTime = new Date(
      new Date().getTime() + oneHourInMilliseconds,
    ).toISOString(); // 1 hour later
    const result = downtimeUtils.isInMaintenanceWindow(startTime, endTime);
    expect(result).to.be.true;
  });

  it('should return false when the current time is outside the maintenance window', () => {
    const startTime = new Date(
      new Date().getTime() - 3 * oneHourInMilliseconds,
    ).toISOString(); // 3 hours ago
    const endTime = new Date(
      new Date().getTime() - oneHourInMilliseconds,
    ).toISOString(); // 1 hour ago
    const result = downtimeUtils.isInMaintenanceWindow(startTime, endTime);
    expect(result).to.be.false;
  });
});

describe('renderMaintenanceWindow', () => {
  it('should render the maintenance window banner when inside the maintenance window', () => {
    const maintArray = [
      {
        externalService: EXTERNAL_SERVICES.global,
        startTime: new Date(
          new Date().getTime() - oneHourInMilliseconds,
        ).toISOString(),
        endTime: new Date(
          new Date().getTime() + oneHourInMilliseconds,
        ).toISOString(),
      },
    ];
    const { container } = render(
      downtimeUtils.renderMaintenanceWindow(maintArray),
    );
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
  });

  it('should return null when outside the maintenance window', () => {
    const maintArray = [
      {
        externalService: EXTERNAL_SERVICES.global,
        startTime: new Date(
          new Date().getTime() - 3 * oneHourInMilliseconds,
        ).toISOString(),
        endTime: new Date(
          new Date().getTime() - oneHourInMilliseconds,
        ).toISOString(),
      },
    ];
    const result = downtimeUtils.renderMaintenanceWindow(maintArray);
    expect(result).to.be.null;
  });

  it('should return null when there are no maintenance windows', () => {
    const maintArray = [];
    const result = downtimeUtils.renderMaintenanceWindow(maintArray);
    expect(result).to.be.null;
  });
});
