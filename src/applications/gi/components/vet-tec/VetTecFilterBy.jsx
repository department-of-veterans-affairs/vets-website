import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import CheckboxGroup from '../CheckboxGroup';
import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';

class VetTecFilterBy extends React.Component {
  static propTypes = {
    showModal: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    providers: PropTypes.object.isRequired,
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

  renderPreferredProviderLabel = () =>
    renderLearnMoreLabel({
      modal: 'preferredProvider',
      showModal: this.props.showModal,
      ariaLabel: ariaLabels.learnMore.preferredProvider,
      component: this,
    });

  render() {
    const label = (
      <span className="preferred-flag">
        Preferred providers&nbsp;&nbsp;
        <i className="fa fa-star vads-u-color--gold" aria-hidden="true" />
      </span>
    );
    const options = [
      {
        name: 'preferredProvider',
        checked: this.props.filters.preferredProvider,
        label,
        learnMore: this.renderPreferredProviderLabel(),
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
