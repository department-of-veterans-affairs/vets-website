import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class CalendarRow extends Component {
  static propTypes = {
    additionalOptions: PropTypes.object,
    cells: PropTypes.array.isRequired,
    currentlySelectedDate: PropTypes.string,
    handleSelectDate: PropTypes.func.isRequired,
    handleSelectOption: PropTypes.func,
    rowNumber: PropTypes.number.isRequired,
    selectedDates: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      showOptions: false,
    };
  }

  getCssClasses = date => {
    let cssClasses = [
      'vaos-calendar__calendar-day',
      'vads-u-color--base',
      'vads-u-background-color--gray-lightest',
      'vads-u-border--1px',
      'vads-u-border-color--base',
      'vads-u-padding-y--1p5',
      'vads-u-font-weight--bold',
      'vads-u-margin-y--1',
    ];

    if (this.isCurrentlySelected(date))
      cssClasses.push('vaos-calendar__cell-current');

    if (this.isInSelectedMap(date)) {
      cssClasses = cssClasses.filter(
        cssClass =>
          ![
            'vads-u-background-color--gray-lightest',
            'vads-u-border--1px',
            'vads-u-color--base',
          ].includes(cssClass),
      );
      cssClasses.push('vaos-calendar__cell-selected');
      cssClasses.push('vads-u-background-color--primary');
    }

    return cssClasses;
  };

  isCurrentlySelected = date => this.props.currentlySelectedDate === date;

  isInSelectedMap = date => this.props.selectedDates[date] !== undefined;

  handleSelectDate = date => {
    this.props.handleSelectDate(date);
  };

  handleSelectOption = e => {
    this.props.handleSelectOption({
      fieldName: this.props.additionalOptions.fieldName,
      value: e.target.value,
    });
  };

  showOptions = () => {
    this.setState({ showOptions: true });
  };

  hideOptions = () => {
    this.setState({ showOptions: false });
  };

  renderOptions = () => {
    const {
      additionalOptions,
      currentlySelectedDate,
      selectedDates,
    } = this.props;
    if (additionalOptions) {
      let showOptions = false;

      for (let index = 0; index < this.props.cells.length; index++) {
        const cell = this.props.cells[index];
        if (cell !== null) {
          if (this.isCurrentlySelected(cell)) {
            showOptions = true;
          }
        }
      }

      if (showOptions) {
        const fieldName = additionalOptions.fieldName;
        return (
          <div className="vaos-calendar__options vads-u-display--flex vads-u-margin-y--2">
            {additionalOptions?.options.map((o, index) => (
              <div
                key={`radio-${index}`}
                className="vaos-calendar__option vads-u-display--flex vads-u-border--1px vads-u-justify-content--center vads-u-align-items--center vads-u-padding-y--1p5 vads-u-padding-x--3 vads-u-margin-right--1 vads-u-border-color--primary"
              >
                <input
                  id={`radio-${index}`}
                  type="radio"
                  name={fieldName}
                  value={o.value}
                  checked={
                    selectedDates[currentlySelectedDate][fieldName] === o.value
                  }
                  onChange={this.handleSelectOption}
                />
                <label
                  className="vads-u-margin--0 vads-u-font-weight--bold vads-u-color--primary"
                  htmlFor={`radio-${index}`}
                >
                  {o.label}
                </label>
              </div>
            ))}
          </div>
        );
      }
      return null;
    }

    return null;
  };

  render() {
    const { cells, rowNumber } = this.props;

    return (
      <div>
        <div className="vaos-calendar__calendar-week">
          {cells.map((date, index) => {
            if (date === null) {
              return (
                <button
                  key={`row-${rowNumber}-cell-${index}`}
                  className="vaos-calendar__calendar-day vads-u-visibility--hidden"
                />
              );
            }

            const cssClasses = this.getCssClasses(date);

            return (
              <button
                key={`row-${rowNumber}-cell-${index}`}
                className={cssClasses.join(' ')}
                onClick={() => this.handleSelectDate(date)}
              >
                {this.isInSelectedMap(date) && (
                  <i className="fas fa-check vads-u-color--white" />
                )}
                {moment(date).format('D')}
                {this.isCurrentlySelected(date) && (
                  <span className="vaos-calendar__cell-selected-triangle" />
                )}
              </button>
            );
          })}
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}
