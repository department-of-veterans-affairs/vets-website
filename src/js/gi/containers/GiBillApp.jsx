import React from 'react';
import { connect } from 'react-redux';
import Modals from '../containers/Modals';
import PreviewBanner from '../components/PreviewBanner';
import Breadcrumbs from '../components/Breadcrumbs';
import AboutThisTool from '../components/AboutThisTool';

function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <div className="row">
        <div className="columns">
          <h4>
            Placeholder message when data is not available
          </h4>
        </div>
      </div>
    );
  } else {
    view = children;
  }

  return <div className="gi-app">{view}</div>;
}

// TODO: Why does this not appear as part of the footer include?
const Disclaimer = () => {
  return (
    <div className="row disclaimer">
      <p>Please note: Content on this Web page is for informational purposes only. It is not intended to provide legal advice or to be a comprehensive statement or analysis of applicable statutes, regulations, and case law governing this topic. Rather, it’s a plain-language summary. If you are seeking claims assistance, your local VA regional office, a VA-recognized Veterans Service Organization, or a VA-accredited attorney or agent can help. <a target="_blank" href="http://www.va.gov/ogc/apps/accreditation/index.asp">Search Accredited Attorneys, Claims Agents, or Veterans Service Organizations (VSO) Representatives</a>.</p>
    </div>
  );
};

class GiBillApp extends React.Component {
  render() {
    return (
      <AppContent>
        <div>
          <div className="row">
            <div className="columns small-12">
              <PreviewBanner show={!!this.props.location.query.preview}/>
              <Breadcrumbs location={this.props.location}/>
              {this.props.children}
              <AboutThisTool/>
              <Disclaimer/>
              <Modals/>
            </div>
          </div>
        </div>
      </AppContent>
    );
  }
}

GiBillApp.propTypes = {
  children: React.PropTypes.element
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GiBillApp);
