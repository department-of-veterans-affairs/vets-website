import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const MrBreadcrumbs = () => {
  const crumbs = useSelector(state => state.mr.breadcrumbs.list);

  return (
    <>
      {crumbs.length > 0 && crumbs[0]?.url ? (
        <div
          className="vads-l-row vads-u-padding-y--1 breadcrumbs-container no-print"
          data-testid="breadcrumbs"
        >
          <va-breadcrumbs label="Breadcrumb">
            <div>
              <span className="breadcrumb-angle vads-u-padding-right--1">
                {'\u2039'}{' '}
              </span>
              <Link to={crumbs[0].url?.toLowerCase()}>
                Back to {crumbs[0].label?.toLowerCase()}
              </Link>
            </div>
          </va-breadcrumbs>
        </div>
      ) : (
        <div
          className="breadcrumbs-container vads-u-padding-bottom--5"
          data-testid="no-breadcrumbs"
        />
      )}
    </>
  );
};

export default MrBreadcrumbs;
