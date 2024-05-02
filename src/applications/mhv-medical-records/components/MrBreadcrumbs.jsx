import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const MrBreadcrumbs = () => {
  const crumbs = useSelector(state => state.mr.breadcrumbs.list);

  return (
    <>
      {crumbs.length > 0 && crumbs[0]?.url ? (
        <div
          className="vads-l-row vads-u-padding-y--3 breadcrumbs-container no-print"
          label="Breadcrumb"
          data-testid="breadcrumbs"
        >
          <span className="breadcrumb-angle vads-u-padding-right--0p5 vads-u-padding-top--0p5">
            <va-icon icon="arrow_back" size={1} />
          </span>
          <Link to={crumbs[0].url?.toLowerCase()}>
            Back to {crumbs[0].label}
          </Link>
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
