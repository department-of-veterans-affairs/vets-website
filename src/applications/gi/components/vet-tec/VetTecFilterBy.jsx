import React from 'react';
import PropTypes from 'prop-types';
import CheckboxGroup from '../CheckboxGroup';
import { renderLearnMoreLabel } from '../../utils/render';
import recordEvent from 'platform/monitoring/record-event';

class VetTecFilterBy extends React.Component {
  static propTypes = {
    showModal: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
  };

  handleFilterChange = e => {
    const { name: field, checked: value } = e.target;
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'preferredProvider',
      'gibct-form-value': value,
    });
    this.props.handleFilterChange(field, value);
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
    const options = [
      {
        name: 'preferredProvider',
        checked: this.props.filters.preferredProvider,
        label: this.renderPreferredProviderLabel(),
      },
    ];

    return (
      <div>
        <CheckboxGroup
          label="Filter by"
          onChange={this.handleFilterChange}
          options={options}
        />
      </div>
    );
  }
}

export default VetTecFilterBy;
