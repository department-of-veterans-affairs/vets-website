import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Breadcrumbs, Paths } from '../util/constants';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { clearPageNumber, setPageNumber } from '../actions/pageTracker';

const MrBreadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const crumbsList = useSelector(state => state.mr.breadcrumbs.crumbsList);
  const pageNumber = useSelector(state => state.mr.pageTracker.pageNumber);
  const phase0p5Flag = useSelector(
    state => state.featureToggles.mhv_integration_medical_records_to_phase_1,
  );

  const [locationBasePath, locationChildPath] = useMemo(
    () => {
      const pathElements = location.pathname.split('/');
      if (pathElements[0] === '') pathElements.shift();
      return pathElements;
    },
    [location],
  );

  const textContent = document.querySelector('h1')?.textContent;
  const searchIndex = new URLSearchParams(window.location.search);
  const page = searchIndex.get('page');

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
            href: `${Breadcrumbs[feature].href.slice(
              0,
              -1,
            )}?page=${pageNumber}`,
          };
          dispatch(setBreadcrumbs([backToPageNumCrumb, detailCrumb]));
        } else {
          dispatch(setBreadcrumbs([Breadcrumbs[feature], detailCrumb]));
        }
      } else {
        dispatch(setBreadcrumbs([Breadcrumbs[feature]]));
      }
    },
    [dispatch, locationBasePath, locationChildPath, textContent, pageNumber],
  );

  const handleRoutechange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
  };

  if (!phase0p5Flag) {
    if (location.pathname === '/' || !crumbsList) {
      return <div className="vads-u-padding-bottom--5" />;
    }
    return (
      <div
        className="vads-l-row vads-u-padding-y--3 breadcrumbs-container no-print"
        label="Breadcrumb"
        data-testid="breadcrumbs"
      >
        <span className="breadcrumb-angle vads-u-padding-right--0p5 vads-u-padding-top--0p5">
          <va-icon icon="arrow_back" size={1} style={{ color: '#808080' }} />
        </span>
        <Link to={crumbsList[crumbsList.length - 2].href}>
          {`Back to ${crumbsList[crumbsList.length - 2].label.toLowerCase()}`}
        </Link>
      </div>
    );
  }

  return (
    <VaBreadcrumbs
      breadcrumbList={crumbsList}
      label="Breadcrumb"
      home-veterans-affairs
      onRouteChange={handleRoutechange}
      className="small-screen:vads-u-margin-y--2"
      dataTestid="breadcrumbs"
      uswds
    />
  );
};

export default MrBreadcrumbs;
