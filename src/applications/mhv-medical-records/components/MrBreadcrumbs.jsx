import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { Breadcrumbs, Paths } from '../util/constants';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { clearPageNumber, setPageNumber } from '../actions/pageTracker';
import { handleDataDogAction, removeTrailingSlash } from '../util/helpers';

const MrBreadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const crumbsList = useSelector(state => state.mr.breadcrumbs.crumbsList);
  const pageNumber = useSelector(state => state.mr.pageTracker.pageNumber);

  const [locationBasePath, locationChildPath] = useMemo(
    () => {
      const pathElements = location.pathname.split('/');
      if (pathElements[0] === '') pathElements.shift();
      return pathElements;
    },
    [location],
  );

  const allowMarchUpdates = useSelector(
    state =>
      state.featureToggles[
      FEATURE_FLAG_NAMES.mhvMedicalRecordsUpdateLandingPage
      ],
  );

  const textContent = document.querySelector('h1')?.textContent;
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page');
  const urlVitalsDate = searchParams.get('timeFrame');
  const { labId, vaccineId, summaryId, allergyId, conditionId } = useParams();

  // Set page number when it's present in the URL
  useEffect(
    () => {
      if (page) dispatch(setPageNumber(+page));
    },
    [page, dispatch],
  );

  // Handle breadcrumb setup based on location
  useEffect(
    () => {
      const path = locationBasePath ? `/${locationBasePath}/` : '/';
      const feature = Object.keys(Paths).find(_path => path === Paths[_path]);

      if (path === '/') {
        dispatch(clearPageNumber());
        dispatch(setBreadcrumbs([]));
      } else if (locationChildPath && textContent) {
        const detailCrumb = {
          href: `${path}${locationChildPath}`,
          label: textContent,
          isRouterLink: true,
        };
        let backToPageNumCrumb;
        if (pageNumber) {
          backToPageNumCrumb = {
            ...Breadcrumbs[feature],
            href: `${removeTrailingSlash(
              Breadcrumbs[feature].href,
            )}?page=${pageNumber}`,
          };
          dispatch(setBreadcrumbs([backToPageNumCrumb, detailCrumb]));
        } else if (urlVitalsDate) {
          const backToVitalsDateCrumb = {
            ...Breadcrumbs[feature],
            href: `${removeTrailingSlash(
              Breadcrumbs[feature].href,
            )}?timeFrame=${urlVitalsDate}`,
          };
          dispatch(setBreadcrumbs([backToVitalsDateCrumb, detailCrumb]));
        } else {
          dispatch(setBreadcrumbs([Breadcrumbs[feature], detailCrumb]));
        }
      } else if (feature === 'SETTINGS' && !allowMarchUpdates) {
        dispatch(
          setBreadcrumbs([
            { ...Breadcrumbs[feature], label: 'Medical records settings' },
          ]),
        );
      } else {
        dispatch(setBreadcrumbs([Breadcrumbs[feature]]));
      }
    },
    [
      dispatch,
      locationBasePath,
      locationChildPath,
      textContent,
      pageNumber,
      urlVitalsDate,
      allowMarchUpdates,
    ],
  );

  const handleRouteChange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
    handleDataDogAction({ locationBasePath, locationChildPath });
  };

  // Build back URL with appropriate query parameters
  const getBackUrl = () => {
    const basePath = `/${locationBasePath}`;
    const queryParams = new URLSearchParams();

    // Preserve page number when returning to list view
    if (pageNumber) {
      queryParams.set('page', pageNumber);
    }

    // Preserve timeFrame for vitals
    if (urlVitalsDate) {
      queryParams.set('timeFrame', urlVitalsDate);
    }

    const queryString = queryParams.toString();
    return `${basePath}${queryString ? `?${queryString}` : ''}`;
  };

  // Determine if we're on a detail page that needs a back button
  const isDetailPage = !!labId || !!vaccineId || !!summaryId || !!allergyId || !!conditionId || location.pathname.includes('/vitals/');

  // Handle back action with analytics
  const handleBackClick = () => {
    handleDataDogAction({ locationBasePath, locationChildPath });
  };

  // Render back button for detail pages
  if (isDetailPage) {
    return (
      <div
        className="vads-l-row vads-u-padding-y--3 breadcrumbs-container no-print"
        label="Breadcrumb"
        data-testid="mr-breadcrumbs"
      >
        <span className="breadcrumb-angle vads-u-padding-right--0p5">
          <va-icon icon="arrow_back" size={1} style={{ color: '#808080' }} />
        </span>
        <Link
          to={getBackUrl()}
          onClick={handleBackClick}
        >
          Back
        </Link>
      </div>
    );
  }

  // Render standard breadcrumbs for non-detail pages
  return (
    <VaBreadcrumbs
      breadcrumbList={crumbsList}
      label="Breadcrumb"
      home-veterans-affairs
      onRouteChange={handleRouteChange}
      className="mobile-lg:vads-u-margin-y--2 no-print"
      dataTestid="breadcrumbs"
      uswds
    />
  );
};

export default MrBreadcrumbs;
