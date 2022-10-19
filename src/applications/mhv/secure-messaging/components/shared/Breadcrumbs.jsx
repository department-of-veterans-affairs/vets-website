import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
// temporarily using deprecated Breadcrumbs React component due to issues with VaBreadcrumbs that are pending resolution
// import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Breadcrumbs as Crumbs } from '@department-of-veterans-affairs/component-library';
import { setBreadcrumbs } from '../../actions/breadcrumbs';
import * as Constants from '../../util/constants';

const Breadcrumbs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const messageDetails = useSelector(state => state.sm.messageDetails.message);
  const activeFolder = useSelector(state => state.sm.folders.folder);
  const breadcrumbsRef = useRef();
  const crumbs = useSelector(state => state.sm.breadcrumbs.list);

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

  return (
    <>
      {crumbs.length > 0 && (
        <Crumbs ref={breadcrumbsRef}>
          {crumbs?.map((crumb, i) => {
            if (crumb.path.includes('https://')) {
              return (
                <a key={i} href={crumb.path}>
                  {crumb.label}
                </a>
              );
            }
            return (
              <Link key={i} to={crumb.path}>
                {crumb.label}
              </Link>
            );
          })}
        </Crumbs>
      )}
    </>
  );
};

export default Breadcrumbs;
