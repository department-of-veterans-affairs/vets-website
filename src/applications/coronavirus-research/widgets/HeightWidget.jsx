import React from 'react';
import _ from 'lodash/fp';
import { getLabelClasses } from './widgetHelper';

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

// const lableStyleClasses =
//   'vads-l-col--1 vads-u-margin-left--1 vads-u-margin-top--3';

export default class HeightWidget extends React.Component {
  // TODO figure this out so error state does not look so bad
  lableStyleClasses = getLabelClasses(
    this.props.value,
    this.props.formContext.touched.root_weight,
  );
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
          <div className={this.lableStyleClasses}>.ft</div>
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
          <div className={this.lableStyleClasses}>.in</div>
        </div>
      </div>
    );
  }
}
HeightWidget.propTypes = {};
