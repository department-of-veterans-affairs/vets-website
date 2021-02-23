import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { enterPreviewMode, exitPreviewMode, fetchConstants } from '../actions';
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
      <div className="row">
        <div className="columns small-12">
          {children}
          <div className="row disclaimer">
            <p>
              Please note: Content on this Web page is for informational
              purposes only. It is not intended to provide legal advice or to be
              a comprehensive statement or analysis of applicable statutes,
              regulations, and case law governing this topic. Rather, it’s a
              plain-language summary. If you are seeking claims assistance, your
              local VA regional office, a VA-recognized Veterans Service
              Organization, or a VA-accredited attorney or agent can help.{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.va.gov/ogc/apps/accreditation/index.asp"
              >
                Search Accredited Attorneys, Claims Agents, or Veterans Service
                Organizations (VSO) Representatives
              </a>
              .
            </p>
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

const mapStateToProps = state => {
  const { constants, preview, search } = state;
  return {
    constants,
    preview,
    search,
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
