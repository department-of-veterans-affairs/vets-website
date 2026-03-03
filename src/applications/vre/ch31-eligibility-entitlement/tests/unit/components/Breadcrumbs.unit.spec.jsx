import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import * as WebComp from '@department-of-veterans-affairs/web-components/react-bindings';

import Breadcrumbs from '../../../components/Breadcrumbs';

WebComp.VaBreadcrumbs = ({ breadcrumbList, ...props }) => (
  <nav data-testid={props['data-testid']}>
    {breadcrumbList.map(({ href, label }) => (
      <a key={href} href={href}>
        {label}
      </a>
    ))}
  </nav>
);

const renderPage = pathname =>
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Breadcrumbs />
    </MemoryRouter>,
  );

const getCrumbs = links =>
  Array.from(links).map(link => ({
    href: link.getAttribute('href'),
    label: link.textContent,
  }));

describe('<Breadcrumbs>', () => {
  it('renders eligibility breadcrumbs on the public eligibility route', () => {
    const { getByTestId, getAllByRole } = renderPage(
      '/careers-employment/your-vre-eligibility',
    );

    expect(getByTestId('breadcrumbs')).to.exist;
    expect(getCrumbs(getAllByRole('link'))).to.deep.equal([
      { href: '/', label: 'VA.gov home' },
      { href: '/careers-employment', label: 'Careers and employment' },
      {
        href: '/careers-employment/your-vre-eligibility',
        label: 'Your VR&E eligibility and benefits',
      },
    ]);
  });

  it('normalizes the internal status route and renders benefit status breadcrumbs', () => {
    const { getAllByRole } = renderPage(
      '/track-your-vre-benefits/vre-benefit-status',
    );

    expect(getCrumbs(getAllByRole('link'))).to.deep.equal([
      { href: '/', label: 'VA.gov home' },
      { href: '/careers-employment', label: 'Careers and employment' },
      {
        href: '/careers-employment/track-your-vre-benefits',
        label: 'Track your VR&E benefits',
      },
      {
        href: '/careers-employment/track-your-vre-benefits/vre-benefit-status',
        label: 'Your VR&E benefit status',
      },
    ]);
  });

  it('renders career planning breadcrumbs for the nested route', () => {
    const { getAllByRole } = renderPage(
      '/careers-employment/track-your-vre-benefits/vre-benefit-status/career-planning',
    );

    expect(getCrumbs(getAllByRole('link'))).to.deep.equal([
      { href: '/', label: 'VA.gov home' },
      { href: '/careers-employment', label: 'Careers and employment' },
      {
        href: '/careers-employment/track-your-vre-benefits',
        label: 'Track your VR&E benefits',
      },
      {
        href: '/careers-employment/track-your-vre-benefits/vre-benefit-status',
        label: 'Your VR&E benefit status',
      },
      {
        href:
          '/careers-employment/track-your-vre-benefits/vre-benefit-status/career-planning',
        label: 'Career Planning',
      },
    ]);
  });

  it('falls back to base breadcrumbs when the route does not match', () => {
    const { getAllByRole } = renderPage('/track-your-vre-benefits/unknown');

    expect(getCrumbs(getAllByRole('link'))).to.deep.equal([
      { href: '/', label: 'VA.gov home' },
      { href: '/careers-employment', label: 'Careers and employment' },
    ]);
  });
});
