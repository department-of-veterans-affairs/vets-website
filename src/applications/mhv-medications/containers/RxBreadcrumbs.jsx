import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom-v5-compat';
import { useBreadcrumbFocus } from 'platform/mhv/hooks/useBreadcrumbFocus';
import { createBreadcrumbs } from '../util/helpers';
import { medicationsUrls } from '../util/constants';
import { selectPageNumber } from '../selectors/selectPreferences';

const RxBreadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prescriptionId } = useParams();
  const currentPage = useSelector(selectPageNumber);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const onRouteChange = useCallback(
    ({ detail }) => {
      const href = detail?.href;
      if (!href) return;

      const url = new URL(href, window.location.origin);
      navigate(`${url.pathname}${url.search}${url.hash}`);
    },
    [navigate],
  );

  const { handleRouteChange, handleClick } = useBreadcrumbFocus({
    onRouteChange,
  });

  useEffect(
    () => {
      setBreadcrumbs(createBreadcrumbs(location, currentPage));
    },
    [location, currentPage],
  );

  let content = null;

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
        onRouteChange={handleRouteChange}
        onClick={handleClick}
        className="no-print va-breadcrumbs-li vads-u-margin-bottom--neg1p5 vads-u-display--block"
      />
    );
  }

  return <div className="no-print">{content}</div>;
};

export default RxBreadcrumbs;
