import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import NeedHelp from '../../components/NeedHelp';

const listPageRegex = /^\/(past\/?)?$/; // matches '/' (this is the appointments list root route), '/past' or '/past/' -- not pending or referrals-requests
export default function PageLayout({
  children,
  showBreadcrumbs,
  showNeedHelp,
}) {
  const location = useLocation();
  const isListPage = listPageRegex.test(location.pathname);
  return (
    <>
      {location.search.includes('?confirmMsg=true') === false && (
        <MhvSecondaryNav />
      )}
      <div className="vads-l-grid-container vads-u-padding-x--2p5 desktop-lg:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        {showBreadcrumbs && <Breadcrumbs />}
        <div className="vads-l-row">
          <div
            className={classNames('vads-u-margin-bottom--2', 'vads-l-col--12', {
              'small-desktop-screen:vads-l-col--10': isListPage,
              'medium-screen:vads-l-col--8': !isListPage,
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
  showBreadcrumbs: PropTypes.bool,
  showNeedHelp: PropTypes.bool,
  style: PropTypes.object,
};
