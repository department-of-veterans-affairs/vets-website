import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useLocation } from 'react-router-dom';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
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
  const isDisplayingDocumentation = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicationsDisplayDocumentationContent
      ],
  );
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(
    () => {
      setBreadcrumbs(
        createBreadcrumbs(location, prescription, pagination?.currentPage),
      );
    },
    [location, prescription, pagination?.currentPage],
  );

  let content = null;

  if (
    !isDisplayingDocumentation &&
    location.pathname.includes(medicationsUrls.subdirectories.DOCUMENTATION)
  ) {
    return null;
  }

  if (
    location.pathname.includes(medicationsUrls.subdirectories.DOCUMENTATION) &&
    prescription?.prescriptionId
  ) {
    content = (
      <div className="include-back-arrow vads-u-margin-bottom--neg1p5 vads-u-padding-y--3">
        <va-link
          href={`${medicationsUrls.PRESCRIPTION_DETAILS}/${
            prescription?.prescriptionId
          }`}
          text={`Back to ${prescription?.prescriptionName}`}
          data-testid="rx-breadcrumb-link"
        />
      </div>
    );
  } else if (
    location.pathname.includes(medicationsUrls.subdirectories.DETAILS) &&
    prescription?.prescriptionId
  ) {
    content = (
      <div className="include-back-arrow vads-u-margin-bottom--neg1p5 vads-u-padding-y--3">
        <va-link
          href={`${
            medicationsUrls.MEDICATIONS_URL
          }?page=${pagination?.currentPage || 1}`}
          text="Back to medications"
          data-testid="rx-breadcrumb-link"
        />
      </div>
    );
  } else if (breadcrumbs.length > 0) {
    content = (
      <VaBreadcrumbs
        uswds
        wrapping
        label="Breadcrumb"
        data-testid="rx-breadcrumb"
        breadcrumbList={breadcrumbs}
        className="no-print va-breadcrumbs-li vads-u-margin-bottom--neg1p5 vads-u-display--block"
      />
    );
  }

  return <div className="no-print">{content}</div>;
};

export default RxBreadcrumbs;
