import PropTypes from 'prop-types';
import React from 'react';

export class VetTecAdditionalInformation extends React.Component {
  render() {
    const it = this.props.institution;
    return (
      <div className="additional-information row">
        <div className="usa-width-one-half medium-6 columns">
          <div className="institution-codes">
            <h3>Institution codes</h3>
            <div>
              <strong>
                <button
                  type="button"
                  className="va-button-link learn-more-button"
                  onClick={this.props.onShowModal.bind(this, 'facilityCode')}
                >
                  VA facility code:
                </button>
                &nbsp;
              </strong>
              {it.facilityCode || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

VetTecAdditionalInformation.propTypes = {
  institution: PropTypes.object,
  onShowModal: PropTypes.func,
};

export default VetTecAdditionalInformation;
