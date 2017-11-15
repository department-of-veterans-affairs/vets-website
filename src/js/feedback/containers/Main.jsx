import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Main extends React.Component {

  render(){
    return (
      <div className="feedback-widget">
        <div className="row">
          <div className="medium-6 columns">
            <h4>Tell us what you think</h4>
            <p>We are always looking for ways to make Vets.gov better.</p>
          </div>
          <div className="medium-6 columns">
            <button className="usa-button-secondary feedback-button">Give us feedback</button>
          </div>
        </div>
      </div>
    )
  }

}

export default Main