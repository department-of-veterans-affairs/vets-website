import React from 'react';
import PropTypes from 'prop-types';

export class VetTecContactInformation extends React.Component {
  render() {
    const it = this.props.institution;

    return (
      <div className="additional-information row">
        <div className="usa-width-one-half medium-6 columns">
          <div className="physical-address">
            <h3>Physical address</h3>
            <div>
              {it.physicalAddress1 && <div>{it.physicalAddress1}</div>}
              {it.physicalAddress2 && <div>{it.physicalAddress2}</div>}
              {it.physicalAddress3 && <div>{it.physicalAddress3}</div>}
              <div>
                {it.physicalCity}, {it.physicalState} {it.physicalZip}
              </div>
            </div>
          </div>
          <div className="institution-codes">
            <h3>School certifying officials</h3>
            <div>TBD</div>
          </div>
        </div>
        <div className="usa-width-one-half medium-6 columns">
          <div className="mailing-address">
            <h3>Mailing address</h3>
            <div>
              {it.address1 && <div>{it.address1}</div>}
              {it.address2 && <div>{it.address2}</div>}
              {it.address3 && <div>{it.address3}</div>}
              <div>
                {it.city}, {it.state} {it.zip}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

VetTecContactInformation.propTypes = {
  institution: PropTypes.object,
  onShowModal: PropTypes.func,
};

export default VetTecContactInformation;
