import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';

const breadcrumbList = [
  { href: '/', label: 'Home' },
  { href: '/burials-memorials', label: 'Burials and memorials' },
  {
    href: '/burials-memorials/veterans-burial-allowance',
    label: 'Burial allowance',
  },
  {
    href: '/21p-530a-interment-allowance',
    label: 'Apply for burial benefits',
  },
];

export const App = ({ children }) => {
  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <VaBreadcrumbs breadcrumbList={breadcrumbList} />
      {children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node,
};
