import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Breadcrumbs, Paths } from '../util/constants';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { setPageNumber } from '../actions/pageTracker';

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
