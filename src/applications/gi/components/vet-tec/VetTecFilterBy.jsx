import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../Checkbox';
import { renderLearnMoreLabel } from '../../utils/render';

class VetTecFilterBy extends React.Component {
  static propTypes = {
    showModal: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
  };

  renderPreferredProviderLabel = () => {
    const label = (
      <div className="preferred-flag">
        Preferred Provider&nbsp;&nbsp;
        <i className="fa fa-star vads-u-color--gold" />
      </div>
    );
    return renderLearnMoreLabel({
      text: label,
      modal: 'preferredProvider',
      showModal: this.props.showModal,
      component: this,
    });
  };

  render() {
    const { vetTec } = this.props.filters;
    return (
      <div>
        <p>Filter by</p>
        <Checkbox
          checked={vetTec.preferredProvider}
          name="inPerson"
          label={this.renderPreferredProviderLabel()}
          onChange={this.props.handleFilterChange}
        />
      </div>
    );
  }
}

export default VetTecFilterBy;
