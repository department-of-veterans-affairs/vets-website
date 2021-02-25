import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { enterPreviewMode, exitPreviewMode, fetchConstants } from '../actions';
import GiBillBreadcrumbs from '../components/GiBillBreadcrumbs';
import Modals from './Modals';
import { useQueryParams } from '../utils/helpers';

export function GiBillApp({
  children,
  dispatchEnterPreviewMode,
  dispatchExitPreviewMode,
  dispatchFetchConstants,
  preview,
}) {
  const queryParams = useQueryParams();
  const version = queryParams.get('version');

  useEffect(
    () => {
      dispatchFetchConstants(version);
    },
    [version],
  );

  useEffect(() => {
    const shouldExitPreviewMode = preview.display && !version;
    const shouldEnterPreviewMode =
      !preview.display && version && preview.version.createdAt;

    if (shouldExitPreviewMode) {
      dispatchExitPreviewMode();
    } else if (shouldEnterPreviewMode) {
      dispatchEnterPreviewMode();
    }
  });

  return (
    <div className="gi-app">
      <div>
        <div>
          <GiBillBreadcrumbs />
          {children}
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GiBillApp);
