import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';

class OnlineClassesFilter extends React.Component {
  static propTypes = {
    onlineClasses: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    showModal: PropTypes.func.isRequired,
  };

  renderLearnMoreLabel = ({ text, modal }) => (
    <span>
      {text} (
      <button
        type="button"
        className="va-button-link learn-more-button"
        onClick={this.props.showModal.bind(this, modal)}
      >
        Learn more
      </button>
      )
    </span>
  );

  render() {
    return (
      <RadioButtons
        label={this.renderLearnMoreLabel({
          text: 'How do you want to take classes?',
          modal: 'onlineOnlyDistanceLearning',
        })}
        name="onlineClasses"
        options={[
          { value: 'yes', label: 'Online only' },
          { value: 'no', label: 'In person only' },
          { value: 'both', label: 'In person and online' },
        ]}
        value={this.props.onlineClasses}
        onChange={this.props.onChange}
      />
    );
  }
}

export default OnlineClassesFilter;
