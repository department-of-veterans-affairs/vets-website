import React from 'react';
import PropTypes from 'prop-types';

function DefaultView({ revealForm }) {
  return (
    <div  id="feedback-initial" className="usa-grid-full">
      <div className="usa-width-three-fourths">
        <p className="feedback-widget-title">Have suggestions to make Vets.gov better? <a id="feedback-tool" onClick={revealForm}>Send us your ideas</a>.</p>
      </div>
    </div>
  );
}

DefaultView.propTypes = {
  revealForm: PropTypes.func.isRequired
};

export default DefaultView;
