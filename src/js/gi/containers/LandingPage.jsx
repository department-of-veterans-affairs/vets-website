import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../actions';

import VideoSidebar from '../components/content/VideoSidebar';
import KeywordSearch from '../components/search/KeywordSearch';
import EligibilityForm from '../components/search/EligibilityForm';

export class LandingPage extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.router.push('/search');
  }

  render() {
    return (
      <span className="landing-page">
        <div className="row">

          <div className="small-12 medium-8 columns">
            <h1>GI Bill Comparison Tool</h1>
            <p className="subheading">Compare programs based on what benefits they can offer you.</p>

            <form onSubmit={this.handleSubmit}>
              <KeywordSearch/>
              <EligibilityForm/>
              <button className="usa-button-big" type="submit" id="search-button">
                <span>Search Schools</span>
              </button>
            </form>
          </div>

          <div className="small-12 medium-4 columns">
            <VideoSidebar/>
          </div>

        </div>
      </span>
    );
  }

  componentDidMount() {
    this.props.setPageTitle('GI Bill Comparison Tool: Vets.gov');
  }

}

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    setPageTitle: (title) => {
      dispatch(actions.setPageTitle(title));
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LandingPage));
