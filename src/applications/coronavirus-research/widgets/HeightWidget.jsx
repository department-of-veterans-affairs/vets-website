import React from 'react';
import _ from 'lodash/fp';

function getInitialState(height) {
  return {
    value: {
      feet: height ? Math.floor(parseInt(height, 10) / 12) : null,
      inches: height ? parseInt(height, 10) % 12 : null,
    },
    touched: {
      feet: !!height,
      inches: !!height,
    },
  };
}

function setLabelStyles(newState) {
  let labelMarginLeftClass = 'vads-u-margin-left--1';
  if (
    newState?.touched.feet &&
    newState.touched.inches &&
    (!newState.value?.feet || !newState.value?.inches)
  ) {
    labelMarginLeftClass = 'vads-u-margin-left--3';
  }
  return `vads-l-col--1 vads-u-margin-top--3 ${labelMarginLeftClass}`;
}
const calculateHeight = ({ feet, inches }) =>
  (parseInt(feet, 10) || 0) * 12 + (parseInt(inches, 10) || 0);

const formatHeightString = height => {
  const feet = Math.floor(parseInt(height, 10) / 12);
  const inches = parseInt(height, 10) % 12;
  return `${feet} ft. ${inches} in.`;
};

export default class HeightWidget extends React.Component {
  state = getInitialState(this.props.value);

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
      const height =
        this.props.required && this.isIncomplete(newState.value)
          ? undefined
          : calculateHeight(newState.value);
      this.props.onChange(height);
      this.labelStyleClasses = setLabelStyles(newState);
    });
  };

  render() {
    const { id, formContext } = this.props;
    const { feet, inches } = this.state.value;
    const inReviewMode = formContext.onReviewPage && formContext.reviewMode;

    const displayValue = inReviewMode ? (
      <div>{formatHeightString(this.props.value)}</div>
    ) : (
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
    return <span>{displayValue}</span>;
  }
}
HeightWidget.propTypes = {};
