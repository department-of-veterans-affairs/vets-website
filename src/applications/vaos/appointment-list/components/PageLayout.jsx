import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import NeedHelp from '../../components/NeedHelp';

export default function PageLayout({
  children,
  showBreadcrumbs,
  showNeedHelp,
  isDetailPage,
}) {
  const location = useLocation();

  return (
    <>
      {location.search.includes('?confirmMsg=true') === false && (
        <MhvSecondaryNav />
      )}
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        {showBreadcrumbs && <Breadcrumbs />}
        <div className="vads-l-row">
          <div
            className={classNames('vads-u-margin-bottom--2', {
              'medium-screen:vads-l-col--8': isDetailPage,
              'vads-l-col--12': !isDetailPage,
            })}
          >
            {children}
            {showNeedHelp && <NeedHelp />}
          </div>
        </div>
      </div>
    </>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node,
  isDetailPage: PropTypes.bool,
  showBreadcrumbs: PropTypes.bool,
  showNeedHelp: PropTypes.bool,
  style: PropTypes.object,
};
