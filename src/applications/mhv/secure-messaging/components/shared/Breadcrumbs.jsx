import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { setBreadcrumbs } from '../../actions/breadcrumbs';

const Breadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const breadcrumbsRef = useRef();
  const crumbs = useSelector(state => state.sm.breadcrumbs.list);

  const updateBreadcrumbs = () => {
    if (breadcrumbsRef.current) {
      const anchorNodes = Array.from(
        breadcrumbsRef.current.querySelectorAll('a'),
      );

      anchorNodes.forEach((crumb, index) => {
        crumb.removeAttribute('aria-current');

        if (index === anchorNodes.length - 1) {
          crumb.setAttribute('aria-current', 'page');
        }
      });
    }
  };

  useEffect(
    () => {
      const paths = [
        { path: '/message', label: 'Message' },
        { path: '/reply', label: 'Reply' },
        { path: '/compose', label: 'Compose message' },
        { path: '/draft', label: 'Edit draft' },
        { path: '/drafts', label: 'Drafts' },
        { path: '/folders', label: 'Folders' },
        { path: '/sent', label: 'Sent messages' },
        { path: '/trash', label: 'Trash' },
        {
          path: '/search',
          label: 'Search messages',
          child: {
            path: '/search?advanced=true',
            label: 'Advanced search',
          },
        },
      ];

      function handleBreadCrumbs() {
        const arr = [];
        arr.push({ path: 'https://www.va.gov', label: 'VA.gov home' });
        arr.push({
          path: 'https://www.va.gov/health-care/',
          label: 'My Health',
        });
        arr.push({ path: '/', label: 'Messages' });

        paths.forEach(path => {
          if (path.path === location.pathname) {
            arr.push(path);
            if (path.child?.path === `${location.pathname}${location.search}`) {
              arr.push(path.child);
            }
          }
        });
        dispatch(setBreadcrumbs(arr, location));
      }
      handleBreadCrumbs();
    },
    [location, dispatch],
  );

  useEffect(
    () => {
      if (breadcrumbsRef.current) {
        updateBreadcrumbs();
      }
    },
    [crumbs],
  );

  return (
    <>
      {crumbs && (
        <VaBreadcrumbs ref={breadcrumbsRef}>
          {crumbs?.map((crumb, i) => {
            return (
              <li key={i} className="va-breadcrumbs-li">
                <Link to={crumb.path}>{crumb.label}</Link>
              </li>
            );
          })}
        </VaBreadcrumbs>
      )}
    </>
  );
};

export default Breadcrumbs;
