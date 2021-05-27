import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import DowntimeNotification from 'platform/monitoring/DowntimeNotification';
import {
  changeSearchTab,
  enterPreviewMode,
  exitPreviewMode,
  fetchConstants,
} from '../actions';
import GiBillBreadcrumbs from '../components/GiBillBreadcrumbs';
import PreviewBanner from '../components/PreviewBanner';
import Modals from './Modals';
import { useQueryParams } from '../utils/helpers';
import ServiceError from '../components/ServiceError';

export function GiBillApp({
  constants,
  children,
  dispatchEnterPreviewMode,
  dispatchExitPreviewMode,
  dispatchFetchConstants,
  dispatchChangeSearchTab,
  preview,
}) {
  const queryParams = useQueryParams();
  const version = queryParams.get('version');
  const versionChange = version && version !== preview.version?.id;
  const shouldExitPreviewMode = preview.display && !version;
  const shouldEnterPreviewMode = !preview.display && versionChange;

  const tab = queryParams.get('search');

  useEffect(
    () => {
      if (shouldExitPreviewMode) {
        dispatchExitPreviewMode();
      } else if (shouldEnterPreviewMode) {
        dispatchEnterPreviewMode(version);
      } else {
        dispatchFetchConstants();
      }

      if (tab) {
        dispatchChangeSearchTab(tab);
      }
    },
    [
      shouldExitPreviewMode,
      shouldEnterPreviewMode,
      dispatchChangeSearchTab,
      dispatchEnterPreviewMode,
      dispatchExitPreviewMode,
      dispatchFetchConstants,
      tab,
      version,
    ],
  );

  return (
    <div className="gi-app" role="application">
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
          <Modals />
        </div>
      </div>
    </div>
  );
}

GiBillApp.propTypes = {
  children: PropTypes.element.isRequired,
};

const mapStateToProps = state => {
  const { constants, preview } = state;
  return {
    constants,
    preview,
  };
};

const mapDispatchToProps = {
  dispatchEnterPreviewMode: enterPreviewMode,
  dispatchExitPreviewMode: exitPreviewMode,
  dispatchFetchConstants: fetchConstants,
  dispatchChangeSearchTab: changeSearchTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GiBillApp);
