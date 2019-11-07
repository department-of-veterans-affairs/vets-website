import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import Checkbox from '../Checkbox';
import CheckboxGroup from '../CheckboxGroup';
import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';

class VetTecFilterBy extends React.Component {
  static propTypes = {
    showModal: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    providers: PropTypes.object.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    handleProviderFilterChange: PropTypes.func.isRequired,
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

  handleProviderFilterChange = (name, checked) => {
    if (!checked) {
      this.props.handleProviderFilterChange({
        provider: [...this.props.filters.provider, name],
      });
    } else {
      this.props.handleProviderFilterChange({
        provider: this.props.filters.provider.filter(
          providerName => providerName !== name,
        ),
      });
    }
  };

  renderPreferredProviderLabel = () =>
    renderLearnMoreLabel({
      modal: 'preferredProvider',
      showModal: this.props.showModal,
      ariaLabel: ariaLabels.learnMore.preferredProvider,
      component: this,
    });

  renderProviderFilters = () => {
    const checkBoxes = Object.keys(this.props.providers)
      .sort()
      .map(key => (
        <div key={key}>
          <Checkbox
            checked={this.props.filters.provider.includes(key)}
            name={key}
            label={`${key} (${this.props.providers[key]})`}
            onChange={() =>
              this.handleProviderFilterChange(
                key,
                this.props.filters.provider.includes(key),
              )
            }
          />
        </div>
      ));

    return (
      <div>
        <p>Filter by provider</p>
        {checkBoxes}
      </div>
    );
  };

  render() {
    const label = (
      <span className="preferred-flag">
        Preferred providers&nbsp;&nbsp;
        <i className="fa fa-star vads-u-color--gold" />
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
        {/* prod flag for CT-116 - #19864 */}
        {!environment.isProduction() && this.renderProviderFilters()}
      </div>
    );
  }
}

export default VetTecFilterBy;
