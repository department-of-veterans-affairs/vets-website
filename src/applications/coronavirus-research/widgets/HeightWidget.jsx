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
function setLabelStyles(newState) {
  let labelMarginLeftClass = 'vads-u-margin-left--1';
  if (
    newState &&
    newState.touched.feet &&
    newState.touched.inches &&
    (!newState.value.feet || !newState.value.inches)
  ) {
    labelMarginLeftClass = 'vads-u-margin-left--3';
  }
  return `vads-l-col--1 vads-u-margin-top--3 ${labelMarginLeftClass}`;
}
const calculateHeight = ({ feet, inches }) =>
  (parseInt(feet, 10) || 0) * 12 + (parseInt(inches, 10) || 0);

export default class HeightWidget extends React.Component {
  state = getEmptyState();
  labelStyleClasses = setLabelStyles();

  isTouched = ({ feet, inches }) => feet && inches;

  isIncomplete = ({ feet, inches }) => !feet || !inches;

  handleBlur = field => {
    const newState = _.set(['touched', field], true, this.state);
    this.setState(newState, () => {
      if (this.isTouched(newState.touched)) {
        this.props.onBlur(this.props.id);
      }
      this.labelStyleClasses = setLabelStyles(newState);
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
      this.labelStyleClasses = setLabelStyles(newState);
    });
  };

  render() {
    const { id } = this.props;
    const { feet, inches } = this.state.value;
    return (
      <div className="vads-l-grid-container--full">
        <div className="vads-l-row">
          <div className="vads-l-col--2">
            <input
              type="number"
              name={`${id}Feet`}
              id={`${id}Feet`}
              value={feet}
              onBlur={() => this.handleBlur('feet')}
              onChange={event => this.handleChange('feet', event.target.value)}
            />
          </div>
          <div className={this.labelStyleClasses}>.ft</div>
          <div className="vads-l-col--2">
            <input
              type="number"
              name={`${id}Inches`}
              id={`${id}Inches`}
              min="0"
              max="11"
              value={inches}
              onBlur={() => this.handleBlur('inches')}
              onChange={event =>
                this.handleChange('inches', event.target.value)
              }
            />
          </div>
          <div className={this.labelStyleClasses}>.in</div>
        </div>
      </div>
    );
  }
}
HeightWidget.propTypes = {};
