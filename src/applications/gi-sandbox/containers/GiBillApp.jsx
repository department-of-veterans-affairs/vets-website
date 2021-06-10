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

export function GiBillApp({
  constants,
  children,
  preview,
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

  // useEffect(() => {
  //   if (tab) {
  //
  //     const onLoadFilters = { ...filters };
  //     Object.keys(filters).forEach(key => {
  //       if (queryParams.has(key)) {
  //         let value = queryParams.get(key);
  //
  //         if (value === 'true') value = true;
  //         else if (value === 'false') value = false;
  //
  //         onLoadFilters[key] = value;
  //       } else if (FILTERS_EXCLUDED_FLIP.includes(key)) {
  //         let value = queryParams.get(`exclude_${key}`);
  //
  //         if (value === 'true') value = true;
  //         else if (value === 'false') value = false;
  //
  //         onLoadFilters[key] = value;
  //       }
  //     });
  //
  //     const distance = queryParams.has('distance')
  //       ? queryParams.get('distance')
  //       : DEFAULT_DISTANCE_SELECTION;
  //
  //     dispatchFilterChange(onLoadFilters);
  //
  //     } else if (queryParams.has('location')) {
  //       dispatchUpdateAutocompleteLocation(queryParams.get('location'));
  //       dispatchFetchSearchByLocationResults(
  //         queryParams.get('location'),
  //         distance,
  //         onLoadFilters,
  //         version,
  //       );
  //     } else if (queryParams.has('latitude') && queryParams.has('longitude')) {
  //       const coordinates = [
  //         queryParams.get('longitude'),
  //         queryParams.get('latitude'),
  //       ];
  //       dispatchFetchSearchByLocationCoords(
  //         null,
  //         coordinates,
  //         distance,
  //         onLoadFilters,
  //         version,
  //       );
  //     }
  //   }
  // }, []);

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

const mapStateToProps = state => ({
  constants: state.constants,
  preview: state.preview,
  filters: state.filters,
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
