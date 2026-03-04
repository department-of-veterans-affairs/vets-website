import React from 'react';
import PropTypes from 'prop-types';
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
WebComp.VaBreadcrumbs.propTypes = {
  breadcrumbList: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  'data-testid': PropTypes.string,
};

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
  it('renders benefit-status breadcrumbs on the app root route', () => {
    const { getAllByRole } = renderPage('/');

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
    const { getAllByRole } = renderPage('/career-planning');

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
});
