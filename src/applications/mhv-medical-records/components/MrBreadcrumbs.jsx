import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
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

  const textContent = document.querySelector('h1')?.textContent;
  const searchIndex = new URLSearchParams(location.search);
  const page = searchIndex.get('page');
  const {
    labId,
    vaccineId,
    summaryId,
    allergyId,
    conditionId,
    radiologyId,
  } = useParams();

  const urlTimeFrame = searchIndex.get('timeFrame');

  useEffect(
    () => {
      if (page) dispatch(setPageNumber(+page));
    },
    [page, dispatch],
  );

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
        } else if (urlTimeFrame) {
          const backToVitalsDateCrumb = {
            ...Breadcrumbs[feature],
            href: `${removeTrailingSlash(
              Breadcrumbs[feature].href,
            )}?timeFrame=${urlTimeFrame}`,
          };
          dispatch(setBreadcrumbs([backToVitalsDateCrumb, detailCrumb]));
        } else {
          dispatch(setBreadcrumbs([Breadcrumbs[feature], detailCrumb]));
        }
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
      urlTimeFrame,
    ],
  );

  const handleRouteChange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
    handleDataDogAction({ locationBasePath, locationChildPath });
  };

  const backToImagesBreadcrumb = location.pathname.includes('/images')
    ? crumbsList[crumbsList.length - 1].href
    : `/${locationBasePath}${pageNumber ? `?page=${pageNumber}` : ''}`;

  const backToAllergiesBreadcrumb = () =>
    location.pathname.includes(`/allergies/${allergyId}`)
      ? history.goBack()
      : `/${locationBasePath}`;

  if (
    location.pathname.includes(
      `/${locationBasePath}/${labId ||
        vaccineId ||
        summaryId ||
        allergyId ||
        conditionId ||
        radiologyId}`,
    )
  ) {
    const url = `${backToImagesBreadcrumb}${
      urlTimeFrame
        ? `${
            backToImagesBreadcrumb?.includes('?') ? '&' : '?'
          }timeFrame=${urlTimeFrame}`
        : ''
    }`;
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
          to={url}
          onClick={() => {
            handleDataDogAction({ locationBasePath, locationChildPath });
            backToAllergiesBreadcrumb();
          }}
        >
          Back
        </Link>
      </div>
    );
  }
  if (location.pathname.includes('/vitals/')) {
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
          to={`${backToImagesBreadcrumb}${
            urlTimeFrame ? `?timeFrame=${urlTimeFrame}` : ''
          }`}
          onClick={() => {
            handleDataDogAction({ locationBasePath, locationChildPath });
            backToAllergiesBreadcrumb();
          }}
        >
          Back
        </Link>
      </div>
    );
  }

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
