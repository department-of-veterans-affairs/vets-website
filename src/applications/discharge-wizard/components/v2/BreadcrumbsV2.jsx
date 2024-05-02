import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const BreadcrumbsV2 = () => (
  <VaBreadcrumbs
    class="xsmall-screen:vads-u-padding-x--1 small-screen:vads-u-padding-x--1p5 medium-screen:vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0"
    label="Breadcrumbs"
    breadcrumbList={[
      {
        href: '/',
        label: 'Home',
      },
      {
        href: '/discharge-upgrade-instructions/introduction',
        label: 'Discharge upgrade',
      },
    ]}
  />
);

export default BreadcrumbsV2;
