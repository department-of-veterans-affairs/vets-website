import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Breadcrumbs from '../../components/Breadcrumbs';
import NeedHelp from '../../components/NeedHelp';

export default function PageLayout({
  children,
  showBreadcrumbs,
  showNeedHelp,
}) {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
      {showBreadcrumbs && <Breadcrumbs />}
      <div className="vads-l-row">
        <div className={classNames('vads-l-col--12', 'vads-u-margin-y--2')}>
          {children}
          {showNeedHelp && <NeedHelp />}
        </div>
      </div>
    </div>
  );
}

PageLayout.propTypes = {
  children: PropTypes.array,
  showBreadcrumbs: PropTypes.bool,
  showNeedHelp: PropTypes.bool,
  style: PropTypes.object,
};
