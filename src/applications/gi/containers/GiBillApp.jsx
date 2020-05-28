import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import DowntimeNotification from 'platform/monitoring/DowntimeNotification';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { enterPreviewMode, exitPreviewMode, fetchConstants } from '../actions';
import Modals from '../containers/Modals';
import PreviewBanner from '../components/heading/PreviewBanner';
import GiBillBreadcrumbs from '../components/heading/GiBillBreadcrumbs';
import AboutThisTool from '../components/content/AboutThisTool';
import ServiceError from '../components/ServiceError';
import Covid19Banner from '../components/heading/Covid19Banner';
import environment from 'platform/utilities/environment';

const Disclaimer = () => (
  <div className="row disclaimer">
    <p>
      Please note: Content on this Web page is for informational purposes only.
      It is not intended to provide legal advice or to be a comprehensive
      statement or analysis of applicable statutes, regulations, and case law
      governing this topic. Rather, it’s a plain-language summary. If you are
      seeking claims assistance, your local VA regional office, a VA-recognized
      Veterans Service Organization, or a VA-accredited attorney or agent can
      help.{' '}
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
);

export class GiBillApp extends React.Component {
  constructor(props) {
    super(props);
    this.exitPreviewMode = this.exitPreviewMode.bind(this);
  }

  componentDidMount() {
    this.props.fetchConstants(this.props.location.query.version);
  }

  componentDidUpdate(prevProps) {
    const {
      preview,
      location: {
        query: { version: uuid },
      },
    } = this.props;

    const shouldExitPreviewMode = preview.display && !uuid;
    const shouldEnterPreviewMode =
      !preview.display && uuid && preview.version.createdAt;

    if (shouldExitPreviewMode) {
      this.props.exitPreviewMode();
    } else if (shouldEnterPreviewMode) {
      this.props.enterPreviewMode();
    }

    const shouldRefetchConstants = prevProps.location.query.version !== uuid;

    if (shouldRefetchConstants) {
      this.props.fetchConstants(uuid);
    }
  }

  exitPreviewMode() {
    const { location } = this.props;
    const query = { ...location.query };
    delete query.version;
    this.props.router.push({ ...location, query });
  }

  render() {
    const { constants, preview, search } = this.props;
    const { facilityCode } = this.props.params;
    let content;

    if (constants.inProgress) {
      content = <LoadingIndicator message="Loading..." />;
    } else {
      content = this.props.children;
    }
    return (
      <div className="gi-app">
        {!environment.isProduction() &&
          this.props.children.props.location.pathname === '/' && (
            <Covid19Banner />
          )}
        <div className="row">
          <div className="columns small-12">
            {preview.display && (
              <PreviewBanner
                version={preview.version}
                onViewLiveVersion={this.exitPreviewMode}
              />
            )}
            <GiBillBreadcrumbs
              searchQuery={search.query}
              facilityCode={facilityCode}
              location={this.props.location}
            />
            <DowntimeNotification appTitle={'GI Bill Comparison Tool'}>
              {constants.error ? <ServiceError /> : content}
            </DowntimeNotification>
            <AboutThisTool />
            <Disclaimer />
            <Modals />
          </div>
        </div>
      </div>
    );
  }
}

GiBillApp.propTypes = {
  children: PropTypes.element.isRequired,
};

const mapStateToProps = state => {
  const { constants, preview, search } = state;
  return { constants, preview, search };
};

const mapDispatchToProps = {
  enterPreviewMode,
  exitPreviewMode,
  fetchConstants,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GiBillApp),
);
