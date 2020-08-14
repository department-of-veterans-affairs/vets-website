import React from 'react';
import _ from 'lodash/fp';

function getEmptyState() {
  return {
    value: {
      feet: null,
      inches: null,
    },
    touched: {
      feet: false,
      inches: false,
    },
  };
}

const calculateHeight = ({ feet, inches }) =>
  (parseInt(feet, 10) || 0) * 12 + (parseInt(inches, 10) || 0);

// Quick hack for prototyping
const inputStyle = {
  display: 'inline-block',
  maxWidth: '8rem',
};

export default class HeightWidget extends React.Component {
  state = getEmptyState();

  isTouched = ({ feet, inches }) => feet && inches;

  isIncomplete = ({ feet, inches }) => !feet || !inches;

  handleBlur = field => {
    const newState = _.set(['touched', field], true, this.state);
    this.setState(newState, () => {
      if (this.isTouched(newState.touched)) {
        this.props.onBlur(this.props.id);
      }
    });
  };

  handleChange = (field, value) => {
    let newState = _.set(['value', field], value, this.state);
    newState = _.set(['touched', field], true, newState);

    this.setState(newState, () => {
      if (this.props.required && this.isIncomplete(newState.value)) {
        this.props.onChange();
      } else {
        this.props.onChange(calculateHeight(newState.value));
      }
    });
  };

  render() {
    const { id } = this.props;
    const { feet, inches } = this.state.value;
    return (
      <div className="row">
        <div
          className="form-height-feet"
          style={{ ...inputStyle, marginRight: '4rem' }}
        >
          <label className="input-height-feet" htmlFor={`${id}Feet`}>
            Feet
          </label>
          <input
            type="number"
            name={`${id}Feet`}
            id={`${id}Feet`}
            value={feet}
            onBlur={() => this.handleBlur('feet')}
            onChange={event => this.handleChange('feet', event.target.value)}
          />
        </div>
        <div className="form-height-inches" style={inputStyle}>
          <label className="input-height-inches" htmlFor={`${id}Inches`}>
            Inches
          </label>
          <input
            type="number"
            name={`${id}Inches`}
            id={`${id}Inches`}
            min="0"
            max="11"
            value={inches}
            onBlur={() => this.handleBlur('inches')}
            onChange={event => this.handleChange('inches', event.target.value)}
          />
        </div>
      </div>
    );
  }
}

HeightWidget.propTypes = {};
