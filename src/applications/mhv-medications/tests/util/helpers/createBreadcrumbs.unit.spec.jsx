import { expect } from 'chai';
import { createBreadcrumbs } from '../../../util/helpers';
import { medicationsUrls } from '../../../util/constants';

describe('createBreadcrumbs', () => {
  const locationMock = pathname => ({ pathname });

  const defaultBreadcrumbs = [
    {
      href: medicationsUrls.VA_HOME,
      label: 'VA.gov home',
    },
    {
      href: medicationsUrls.MHV_HOME,
      label: 'My HealtheVet',
    },
  ];

  it('should return empty array for an unknown path', () => {
    const breadcrumbs = createBreadcrumbs(
      locationMock('/unknown/path'),
      null,
      1,
    );
    expect(breadcrumbs).to.deep.equal([]);
  });

  it('should return breadcrumbs for the BASE path', () => {
    const breadcrumbs = createBreadcrumbs(
      locationMock(medicationsUrls.subdirectories.BASE),
      2,
    );
    expect(breadcrumbs).to.deep.equal([
      ...defaultBreadcrumbs,
      {
        href: `${medicationsUrls.MEDICATIONS_URL}?page=2`,
        label: 'Medications',
      },
    ]);
  });

  it('should return breadcrumbs for the BASE path with empty currentPage', () => {
    const breadcrumbs = createBreadcrumbs(
      locationMock(medicationsUrls.subdirectories.BASE),
      null,
    );
    expect(breadcrumbs).to.deep.equal([
      ...defaultBreadcrumbs,
      {
        href: `${medicationsUrls.MEDICATIONS_URL}?page=1`,
        label: 'Medications',
      },
    ]);
  });

  it('should return breadcrumbs for the REFILL path', () => {
    const breadcrumbs = createBreadcrumbs(
      locationMock(medicationsUrls.subdirectories.REFILL),
      1,
    );
    expect(breadcrumbs).to.deep.equal([
      ...defaultBreadcrumbs,
      { href: medicationsUrls.MEDICATIONS_URL, label: 'Medications' },
      {
        href: medicationsUrls.MEDICATIONS_REFILL,
        label: 'Refill prescriptions',
      },
    ]);
  });
});
