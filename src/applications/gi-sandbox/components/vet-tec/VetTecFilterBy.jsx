import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import Checkbox from '../Checkbox';
import CheckboxGroup from '../CheckboxGroup';
import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';

class VetTecFilterBy extends React.Component {
  static propTypes = {
    showModal: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    providers: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
      }),
    ).isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    handleProviderFilterChange: PropTypes.func.isRequired,
    handleInputFocus: PropTypes.func,
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
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': name,
      'gibct-form-value': !checked,
    });
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
    const checkBoxes = this.props.providers
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(provider => (
        <div key={provider.name}>
          <Checkbox
            checked={this.props.filters.provider.includes(provider.name)}
            name={provider.name}
            label={`${provider.name} (${provider.count})`}
            onChange={() =>
              this.handleProviderFilterChange(
                provider.name,
                this.props.filters.provider.includes(provider.name),
              )
            }
            onFocus={this.props.handleInputFocus}
          />
        </div>
      ));

    return (
      <div className="vet-tec-provider-filters">
        <p>Filter by provider</p>
        {checkBoxes}
      </div>
    );
  };

  render() {
    const label = (
      <span className="preferred-flag">
        Preferred provider&nbsp;&nbsp;
        {this.props.filters.preferredProvider ? (
          <i className="fa fa-star vads-u-color--gold" />
        ) : (
          <i className="fa fa-star vads-u-color--gray-medium" />
        )}
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
          label=""
          onChange={this.handleFilterChange}
          options={options}
          onFocus={this.props.handleInputFocus}
        />
        {this.renderProviderFilters()}
      </div>
    );
  }
}

export default VetTecFilterBy;
