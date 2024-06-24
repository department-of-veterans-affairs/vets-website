import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Breadcrumbs from '../../components/Breadcrumbs';
import NeedHelp from '../../components/NeedHelp';
import { selectFeatureMhvSecondaryNavigationEnabled } from '../../redux/selectors';

export default function PageLayout({
  children,
  showBreadcrumbs,
  showNeedHelp,
}) {
  const location = useLocation();
  const featureMhvSecondaryNavigationEnabled = useSelector(
    selectFeatureMhvSecondaryNavigationEnabled,
  );

  return (
    <>
      {featureMhvSecondaryNavigationEnabled &&
        location.search.includes('?confirmMsg=true') === false && (
          <MhvSecondaryNav />
        )}
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        {showBreadcrumbs && <Breadcrumbs />}
        <div className="vads-l-row">
          <div
            className={classNames('vads-l-col--12', 'vads-u-margin-bottom--2')}
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
