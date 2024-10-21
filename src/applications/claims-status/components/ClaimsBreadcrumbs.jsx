import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useNavigate } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import { CST_BREADCRUMB_BASE } from '../constants';

function ClaimsBreadcrumbs({ crumbs = [] }) {
  const navigate = useNavigate();
  const breadcrumbList = CST_BREADCRUMB_BASE.concat(crumbs);

  function handleRouteChange({ detail }) {
    const { href } = detail;
    navigate(href);
  }

  return (
    <VaBreadcrumbs
      breadcrumbList={breadcrumbList}
      onRouteChange={handleRouteChange}
      wrapping
    />
  );
}

ClaimsBreadcrumbs.propTypes = {
  crumbs: PropTypes.array,
};

export default ClaimsBreadcrumbs;
