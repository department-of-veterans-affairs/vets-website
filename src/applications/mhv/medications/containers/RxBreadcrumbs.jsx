import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useLocation } from 'react-router-dom';
import { medicationsUrls } from '../util/constants';
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
      {!medicationsUrls.MEDICATIONS_ABOUT.endsWith(location.pathname) &&
        breadcrumbs.length > 0 && (
          <div className="no-print rx-breadcrumbs">
            <VaBreadcrumbs
              uswds
              wrapping
              label="Breadcrumb"
              data-testid="rx-breadcrumb"
              home-veterans-affairs="false"
              breadcrumbList={breadcrumbs}
              className={`${alignToLeft} vads-u-display--none small-screen:vads-u-display--block va-breadcrumbs-li vads-u-padding-bottom--0 vads-u-padding-top--4 vads-u-margin-bottom--neg1p5`}
            />
            <va-link
              className="vads-u-display--block small-screen:vads-u-display--none"
              href={breadcrumbs[breadcrumbs.length - 2].url}
              text={breadcrumbs[breadcrumbs.length - 2].label}
            />
          </div>
        )}
    </>
  );
};

export default RxBreadcrumbs;
