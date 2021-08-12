import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import DowntimeNotification from 'platform/monitoring/DowntimeNotification';
import {
  enterPreviewMode,
  exitPreviewMode,
  fetchConstants,
  updateQueryParams,
} from '../actions';
import GiBillBreadcrumbs from '../components/GiBillBreadcrumbs';
import PreviewBanner from '../components/PreviewBanner';
import Modals from './Modals';
import { useQueryParams } from '../utils/helpers';
import ServiceError from '../components/ServiceError';
import AboutThisTool from '../components/content/AboutThisTool';
import Disclaimer from '../components/content/Disclaimer';
import { useLocation } from 'react-router-dom';
import Covid19Banner from '../components/content/Covid19Banner';
import CompareDrawer from './CompareDrawer';

export function GiBillApp({
  constants,
  children,
  preview,
  compare,
  dispatchEnterPreviewMode,
  dispatchExitPreviewMode,
  dispatchFetchConstants,
  dispatchUpdateQueryParams,
}) {
  const queryParams = useQueryParams();
  const version = queryParams.get('version');
  const versionChange = version && version !== preview.version?.id;
  const shouldExitPreviewMode = preview.display && !version;
  const shouldEnterPreviewMode = !preview.display && versionChange;
  const location = useLocation();

  useEffect(
    () => {
      if (shouldExitPreviewMode) {
        dispatchExitPreviewMode();
      } else if (shouldEnterPreviewMode) {
        dispatchEnterPreviewMode(version);
      } else {
        dispatchFetchConstants();
      }
    },
    [shouldExitPreviewMode, shouldEnterPreviewMode],
  );

  useEffect(() => {
    let params = {};
    for (const [key, value] of queryParams.entries()) {
      params = {
        ...params,
        [key]: value,
      };
    }
    dispatchUpdateQueryParams(params);
  }, []);

  const onProfilePage = location.pathname.includes('/profile');
  const onComparePage = location.pathname.includes('/compare');

  return (
    <div className="gi-app" role="application">
      {(location.pathname === '/' ||
        location.pathname === '/gi-bill-comparison-tool-sandbox') && (
        <Covid19Banner />
      )}
      <div>
        <div>
          {preview.display && <PreviewBanner version={preview.version} />}
          <GiBillBreadcrumbs />
          {constants.inProgress && <LoadingIndicator message="Loading..." />}
          {constants.error && <ServiceError />}
          {!(constants.error || constants.inProgress) && (
            <DowntimeNotification appTitle={'GI Bill Comparison Tool'}>
              {children}
            </DowntimeNotification>
          )}
          {compare.open && <div style={{ height: '12px' }}>&nbsp;</div>}
          {!compare.open && (
            <div className="row vads-u-padding--1p5 small-screen:vads-u-padding--0">
              <>
                <AboutThisTool />
                <Disclaimer />
              </>
            </div>
          )}
          {!onComparePage && <CompareDrawer alwaysDisplay={onProfilePage} />}
          <Modals />
        </div>
      </div>
    </div>
  );
}

GiBillApp.propTypes = {
  children: PropTypes.element.isRequired,
};

const mapStateToProps = state => ({
  constants: state.constants,
  preview: state.preview,
  compare: state.compare,
});

const mapDispatchToProps = {
  dispatchEnterPreviewMode: enterPreviewMode,
  dispatchExitPreviewMode: exitPreviewMode,
  dispatchFetchConstants: fetchConstants,
  dispatchUpdateQueryParams: updateQueryParams,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GiBillApp);
