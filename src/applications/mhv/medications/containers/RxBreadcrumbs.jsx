import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useLocation } from 'react-router-dom';
import { createBreadcrumbs } from '../util/helpers';

const alignToLeft = `va-nav-breadcrumbs xsmall-screen:vads-u-margin-left--neg1
small-screen:vads-u-margin-left--neg1
medium-screen:vads-u-margin-left--neg2
small-desktop-screen:vads-u-margin-left--neg2
large-screen:vads-u-margin-left--0 `;

const RxBreadcrumbs = () => {
  const location = useLocation();
  const prescription = useSelector(
    state => state.rx.prescriptions?.prescriptionDetails,
  );
  const pagination = useSelector(
    state => state.rx.prescriptions?.prescriptionsPagination,
  );
  const [breadcrumbs, setBreadcrumbs] = React.useState([]);
  useEffect(
    () => {
      setBreadcrumbs(
        createBreadcrumbs(location, prescription, pagination?.currentPage),
      );
    },
    [location, prescription, pagination?.currentPage],
  );

  return (
    <>
      {breadcrumbs.length > 0 && (
        <VaBreadcrumbs
          uswds
          wrapping
          label="Breadcrumb"
          data-testid="rx-breadcrumb"
          home-veterans-affairs="false"
          breadcrumbList={breadcrumbs}
          className={`${alignToLeft} no-print va-breadcrumbs-li vads-u-padding-bottom--2p5 vads-u-padding-top--0 vads-u-margin-bottom--neg1p5`}
        />
      )}
    </>
  );
};

export default RxBreadcrumbs;
