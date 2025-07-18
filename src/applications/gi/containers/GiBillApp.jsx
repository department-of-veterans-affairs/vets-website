import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import DowntimeNotification from 'platform/monitoring/DowntimeNotification';
import { useLocation } from 'react-router-dom';
import {
  enterPreviewMode,
  exitPreviewMode,
  fetchConstants,
  updateQueryParams,
} from '../actions';
import GiBillBreadcrumbs from '../components/GiBillBreadcrumbs';
import PreviewBanner from '../components/PreviewBanner';
import Modals from './Modals';
import { scrollToFocusedElement, useQueryParams } from '../utils/helpers';
import ServiceError from '../components/ServiceError';
import Disclaimer from '../components/content/Disclaimer';
import CompareDrawer from './CompareDrawer';
import { AboutThisTool } from '../updated-gi/components/AboutThisTool';

export function GiBillApp({
  constants,
  children,
  preview,
  compare,
  dispatchEnterPreviewMode,
  dispatchExitPreviewMode,
  dispatchFetchConstants,
  dispatchUpdateQueryParams,
  TESTVERSION = false, // used with unit testing for extended test coverage
  TESTVALUE = false, // used with unit testing for extended test coverage
}) {
  const queryParams = useQueryParams();
  const version = TESTVERSION ? TESTVALUE : queryParams.get('version');
  const versionChange = version && version !== preview.version?.id;
  const shouldExitPreviewMode = preview.display && !version;
  const shouldEnterPreviewMode = !preview.display && versionChange;
  const location = useLocation();

  useEffect(() => {
    document.addEventListener('focus', scrollToFocusedElement, true);
    return () => {
      document.removeEventListener('focus', scrollToFocusedElement);
    };
  }, []);

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
    const params = {};
    for (const [key, value] of queryParams.entries()) {
      if (key.includes('[]')) {
        const arrayKey = key.replace('[]', '');
        if (!params[arrayKey]) {
          params[arrayKey] = [];
        }
        params[arrayKey].push(value);
      } else {
        params[key] = value;
      }
    }
    dispatchUpdateQueryParams(params);
  }, []);

  const onProfilePage = location.pathname.includes('/institution');
  const onComparePage = location.pathname.includes('/compare');
  const showDisclaimer = onComparePage || !compare.open;
  const onProgramPage = /\/institution\/[^/]+\/[^/]+$/.test(location.pathname);

  return (
    <div className="gi-app">
      <div>
        <div>
          {preview.display && <PreviewBanner version={preview.version} />}
          <div className="desktop-lg:vads-u-padding-left--0 vads-u-padding-left--2">
            <GiBillBreadcrumbs />
          </div>
          {constants.inProgress && (
            <VaLoadingIndicator
              data-testid="loading-indicator"
              message="Loading..."
            />
          )}
          {constants.error && <ServiceError />}
          {!(constants.error || constants.inProgress) && (
            <DowntimeNotification appTitle="GI Bill® Comparison Tool">
              {children}
            </DowntimeNotification>
          )}
          {!showDisclaimer && <div style={{ height: '12px' }}>&nbsp;</div>}
          {showDisclaimer && (
            <div className="row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
              <>
                <AboutThisTool />
                <Disclaimer />
              </>
            </div>
          )}
          {!onComparePage &&
            !onProgramPage && (
              <CompareDrawer
                alwaysDisplay={onProfilePage}
                showDisclaimer={showDisclaimer}
              />
            )}
          <Modals />
        </div>
      </div>
    </div>
  );
}

GiBillApp.propTypes = {
  children: PropTypes.element.isRequired,
  TESTVALUE: PropTypes.bool,
  TESTVERSION: PropTypes.bool,
  compare: PropTypes.object,
  constants: PropTypes.object,
  dispatchEnterPreviewMode: PropTypes.func,
  dispatchExitPreviewMode: PropTypes.func,
  dispatchFetchConstants: PropTypes.func,
  dispatchUpdateQueryParams: PropTypes.func,
  preview: PropTypes.object,
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
