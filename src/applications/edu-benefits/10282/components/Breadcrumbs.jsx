import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = () => (
  <div className="row">
    <div className="vads-u-margin-left--2 small-screen:vads-u-margin-left--1">
      <VaBreadcrumbs
        label="Breadcrumbs"
        breadcrumbList={[
          {
            href: '/',
            label: 'Home',
          },
          {
            href: '/education',
            label: 'Education and training',
          },
          {
            href: '/education/apply-for-education-benefits/10282/',
            label: 'Apply for the IBM SkillsBuild program',
          },
        ]}
      />
    </div>
  </div>
);

export default Breadcrumbs;
