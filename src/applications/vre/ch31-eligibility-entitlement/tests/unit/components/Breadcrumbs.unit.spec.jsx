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

  it('renders eligibility breadcrumbs on the app root route', () => {
    const { getAllByRole } = renderPage('/');

    expect(getCrumbs(getAllByRole('link'))).to.deep.equal([
      { href: '/', label: 'VA.gov home' },
      { href: '/careers-employment', label: 'Careers and employment' },
      {
        href: '/careers-employment/your-vre-eligibility',
        label: 'Your VR&E eligibility and benefits',
      },
    ]);
  });

  it('falls back to base breadcrumbs when the route does not match', () => {
    const { getAllByRole } = renderPage('/careers-employment/unknown');

    expect(getCrumbs(getAllByRole('link'))).to.deep.equal([
      { href: '/', label: 'VA.gov home' },
      { href: '/careers-employment', label: 'Careers and employment' },
    ]);
  });
});
