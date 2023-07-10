import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Breadcrumbs from '../../components/Breadcrumbs';
import NeedHelp from '../../components/NeedHelp';
import { selectFeatureAppointmentList } from '../../redux/selectors';

export default function PageLayout({
  children,
  showBreadcrumbs,
  showNeedHelp,
  style,
}) {
  const featureAppointmentList = useSelector(state =>
    selectFeatureAppointmentList(state),
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
      {showBreadcrumbs && <Breadcrumbs />}
      <div className="vads-l-row">
        <div
          style={{ ...style }}
          className={classNames('vads-l-col--12', 'vads-u-margin--2', {
            'medium-screen:vads-l-col--8': !featureAppointmentList,
          })}
        >
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
