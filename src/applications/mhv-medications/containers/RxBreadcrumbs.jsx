import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useLocation } from 'react-router-dom';
import { createBreadcrumbs } from '../util/helpers';
import { medicationsUrls } from '../util/constants';

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
      {breadcrumbs.length > 0 &&
        !location.pathname.includes(medicationsUrls.subdirectories.DETAILS) && (
          <VaBreadcrumbs
            uswds
            wrapping
            label="Breadcrumb"
            data-testid="rx-breadcrumb"
            breadcrumbList={breadcrumbs}
            className="no-print va-breadcrumbs-li vads-u-margin-bottom--neg1p5 vads-u-display--block"
          />
        )}
      {location.pathname.includes(medicationsUrls.subdirectories.DETAILS) && (
        <div className="include-back-arrow vads-u-margin-bottom--neg1p5 vads-u-padding-y--3">
          <va-link
            href={`${
              medicationsUrls.MEDICATIONS_URL
            }?page=${pagination?.currentPage || 1}`}
            text="Back to Medications"
            data-testid="rx-breadcrumb-link"
          />
        </div>
      )}
    </>
  );
};

export default RxBreadcrumbs;
