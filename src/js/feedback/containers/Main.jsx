import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Main extends React.Component {

  render(){
    return (
      <div className="feedback-widget">
        <div className="usa-grid">
          <div className="usa-width-one-third">
            <h4>Tell us what you think</h4>
            <p>We are always looking for ways to make Vets.gov better</p>
          </div>
          <div className="usa-width-two-thirds">
            <button className="usa-button-secondary">Give us feedback</button>
          </div>
        </div>
      </div>
    )
  }

}

export default Main