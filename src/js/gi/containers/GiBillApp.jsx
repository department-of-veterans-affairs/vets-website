import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Modals from '../containers/Modals';
import PreviewBanner from '../components/heading/PreviewBanner';
import Breadcrumbs from '../components/heading/Breadcrumbs';
import AboutThisTool from '../components/content/AboutThisTool';

const Disclaimer = () => {
  return (
    <div className="row disclaimer">
      <p>Please note: Content on this Web page is for informational purposes only. It is not intended to provide legal advice or to be a comprehensive statement or analysis of applicable statutes, regulations, and case law governing this topic. Rather, it’s a plain-language summary. If you are seeking claims assistance, your local VA regional office, a VA-recognized Veterans Service Organization, or a VA-accredited attorney or agent can help. <a target="_blank" href="http://www.va.gov/ogc/apps/accreditation/index.asp">Search Accredited Attorneys, Claims Agents, or Veterans Service Organizations (VSO) Representatives</a>.</p>
    </div>
  );
};

class GiBillApp extends React.Component {

  componentWillMount() {
    this.props.updateConstants();
  }

  render() {
    return (
      <div className="gi-app">
        <div className="row">
          <div className="columns small-12">
            <PreviewBanner show={this.props.preview.display} version={this.props.preview.version}/>
            <Breadcrumbs location={this.props.location} profileName={this.props.profile.attributes.name}/>
            {this.props.children}
            <AboutThisTool/>
            <Disclaimer/>
            <Modals/>
          </div>
        </div>
      </div>
    );
  }

}

GiBillApp.propTypes = {
  children: React.PropTypes.element.isRequired
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    setPageTitle: (title) => {
      dispatch(actions.setPageTitle(title));
    },
    enterPreviewMode: (version) => {
      dispatch(actions.enterPreviewMode(version));
    },
    updateConstants: () => {
      dispatch(actions.fetchConstants());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GiBillApp);
