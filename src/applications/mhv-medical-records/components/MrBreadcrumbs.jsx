import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Breadcrumbs, Paths } from '../util/constants';
import { setBreadcrumbs } from '../actions/breadcrumbs';

const MrBreadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const crumbsList = useSelector(state => state.mr.breadcrumbs.crumbsList);

  const [locationBasePath, locationChildPath] = useMemo(
    () => {
      const pathElements = location.pathname.split('/');
      if (pathElements[0] === '') pathElements.shift();
      return pathElements;
    },
    [location],
  );

  const headingText = document.querySelector('h1');
  const textContent = headingText?.textContent;

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
        dispatch(setBreadcrumbs([Breadcrumbs[feature], detailCrumb]));
      } else {
        dispatch(setBreadcrumbs([Breadcrumbs[feature]]));
      }
    },
    [dispatch, locationBasePath, locationChildPath, textContent],
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
