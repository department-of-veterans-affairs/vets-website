import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { CST_BREADCRUMB_BASE } from '../constants';

function ClaimsBreadcrumbs({ crumbs = [], router }) {
  const breadcrumbList = CST_BREADCRUMB_BASE.concat(crumbs);

  function handleRouteChange({ detail }) {
    const { href } = detail;
    router.push(href);
  }

  return (
    <VaBreadcrumbs
      breadcrumbList={breadcrumbList}
      onRouteChange={handleRouteChange}
    />
  );
}

ClaimsBreadcrumbs.propTypes = {
  crumbs: PropTypes.array,
  router: PropTypes.object,
};

export default withRouter(ClaimsBreadcrumbs);
