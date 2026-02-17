import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = () => {
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/education',
      label: 'Education and training',
    },
    {
      href: '/education/disclose-information-to-third-party',
      label:
        'Disclose personal information to a third party for education benefits',
    },
    {
      href: '/education/disclose-information-to-third-party/authorize-disclosure-form-22-10278',
      label:
        'Authorize VA to disclose personal information to a third party for education benefits',
    },
  ];
  return (
    <div className="row">
      <div className="vads-u-margin-left--2 mobile-lg:vads-u-margin-left--1">
        <VaBreadcrumbs
          breadcrumbList={crumbs}
          data-testid="breadcrumbs"
          wrapping
        />
      </div>
    </div>
  );
};

export default Breadcrumbs;
