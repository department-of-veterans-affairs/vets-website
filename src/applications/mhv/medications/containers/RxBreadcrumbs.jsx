import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useLocation } from 'react-router-dom';
import { createBreadcrumbs } from '../util/helpers';
import { medicationsUrls } from '../util/constants';

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
        <>
          {!location.pathname.includes(
            medicationsUrls.subdirectories.DETAILS,
          ) ? (
            <VaBreadcrumbs
              uswds
              wrapping
              label="Breadcrumb"
              data-testid="rx-breadcrumb"
              home-veterans-affairs="false"
              breadcrumbList={breadcrumbs}
              className={`${alignToLeft} no-print va-breadcrumbs-li vads-u-margin-bottom--neg1p5 vads-u-display--block`}
            />
          ) : (
            <div className="include-back-arrow vads-u-margin-bottom--neg1p5 vads-u-padding-y--3">
              <va-link
                href={breadcrumbs[breadcrumbs.length - 2].href}
                text={`Back to ${breadcrumbs[breadcrumbs.length - 2].label}`}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default RxBreadcrumbs;
