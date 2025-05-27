import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useLocation, useParams } from 'react-router-dom-v5-compat';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { createBreadcrumbs } from '../util/helpers';
import { medicationsUrls } from '../util/constants';
import { selectRemoveLandingPageFlag } from '../util/selectors';

const RxBreadcrumbs = () => {
  const location = useLocation();
  const { prescriptionId } = useParams();
  const currentPage = useSelector(state => state.rx.preferences.pageNumber);
  const isDisplayingDocumentation = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicationsDisplayDocumentationContent
      ],
  );
  const removeLandingPage = useSelector(selectRemoveLandingPageFlag);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(
    () => {
      setBreadcrumbs(
        // TODO: remove removeLandingPage part once mhvMedicationsRemoveLandingPage is turned on in prod
        createBreadcrumbs(location, currentPage, removeLandingPage),
      );
    },
    [location, currentPage, removeLandingPage],
  );

  let content = null;

  if (
    !isDisplayingDocumentation &&
    location.pathname.includes(medicationsUrls.subdirectories.DOCUMENTATION)
  ) {
    return null;
  }

  if (
    location.pathname.includes(medicationsUrls.subdirectories.DOCUMENTATION)
  ) {
    content = (
      <div className="include-back-arrow vads-u-margin-bottom--neg1p5 vads-u-padding-y--3">
        <va-link
          href={`${medicationsUrls.PRESCRIPTION_DETAILS}/${prescriptionId}`}
          text="Back"
          data-testid="rx-breadcrumb-link"
        />
      </div>
    );
  } else if (
    location.pathname.includes(medicationsUrls.subdirectories.DETAILS)
  ) {
    content = (
      <div className="include-back-arrow vads-u-margin-bottom--neg1p5 vads-u-padding-y--3">
        <va-link
          href={`${medicationsUrls.MEDICATIONS_URL}/`}
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
