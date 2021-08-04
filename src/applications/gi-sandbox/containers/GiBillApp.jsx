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
              <div className="tool-description">
                <h1>GI Bill® Comparison Tool</h1>
                <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
                  Use the GI Bill Comparison Tool to see how VA education
                  benefits can pay for your education.
                </p>
              </div>
              {children}
            </DowntimeNotification>
          )}
          <div className="row">
            <AboutThisTool />
            <div className="row disclaimer">
              <p>
                Please note: Content on this Web page is for informational
                purposes only. It is not intended to provide legal advice or to
                be a comprehensive statement or analysis of applicable statutes,
                regulations, and case law governing this topic. Rather, it’s a
                plain-language summary. If you are seeking claims assistance,
                your local VA regional office, a VA-recognized Veterans Service
                Organization, or a VA-accredited attorney or agent can help.{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.va.gov/ogc/apps/accreditation/index.asp"
                >
                  Search Accredited Attorneys, Claims Agents, or Veterans
                  Service Organizations (VSO) Representatives
                </a>
                .
              </p>
            </div>
          </div>
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
