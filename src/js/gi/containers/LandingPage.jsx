import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import VideoSidebar from '../components/VideoSidebar';

export class LandingPage extends React.Component {

  renderPageTitle() {
    document.title = 'GI Bill Comparison Tool: Vets.gov';
  }

  render() {
    this.renderPageTitle();
    return (
      <span className="landing-page">
        <div className="row">
          <form action="/gi-bill-comparison-tool/institutions/search">

            <div className="small-12 medium-8 columns">
              <h1>GI Bill Comparison Tool</h1>
              <p className="subheading">Learn about education programs and compare estimated benefits by school.</p>

              <h6>Form Elements Go Here</h6>
            </div>

            <div className="small-12 medium-4 columns">
              <VideoSidebar/>
            </div>

          </form>
        </div>
      </span>
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (name) => {
      dispatch(actions.displayModal(name));
    },
    hideModal: () => {
      dispatch(actions.displayModal(null));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
