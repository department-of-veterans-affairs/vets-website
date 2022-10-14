import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { setBreadcrumbs } from '../../actions/breadcrumbs';
import * as Constants from '../../util/constants';

const Breadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const messageDetails = useSelector(state => state.sm.messageDetails.message);
  const activeFolder = useSelector(state => state.sm.folders.folder);
  const breadcrumbsRef = useRef();
  const crumbs = useSelector(state => state.sm.breadcrumbs.list);

  /**
   * <va-breadcrumbs> component is not stable in handling removing crumbs
   * when rerendering the state. As a result, it errouneously handles current page
   * attributes when nodes are added or removed. This function was inherited from
   * VAOS team, removes aria-current from all nodes and then adds to the last one
   */
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
        {
          path: `/message/${messageDetails?.messageId}`,
          label: messageDetails?.subject,
        },
        { path: '/reply', label: messageDetails?.subject },
        Constants.Breadcrumbs.COMPOSE,
        Constants.Breadcrumbs.DRAFT,
        Constants.Breadcrumbs.DRAFTS,
        {
          path: `/folder/${activeFolder?.folderId}`,
          label: activeFolder?.name,
        },
        Constants.Breadcrumbs.FOLDERS,
        Constants.Breadcrumbs.SENT,
        Constants.Breadcrumbs.TRASH,
        {
          ...Constants.Breadcrumbs.SEARCH,
          child: Constants.Breadcrumbs.SEARCH_ADVANCED,
        },
        Constants.Breadcrumbs.FAQ,
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
    [location, dispatch, messageDetails, activeFolder],
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
                {crumb.path.includes('https://') ? (
                  // links with absolute path must be passed to <a> element
                  <a href={crumb.path}>{crumb.label}</a>
                ) : (
                  <Link to={crumb.path}>{crumb.label}</Link>
                )}
              </li>
            );
          })}
        </VaBreadcrumbs>
      )}
    </>
  );
};

export default Breadcrumbs;
