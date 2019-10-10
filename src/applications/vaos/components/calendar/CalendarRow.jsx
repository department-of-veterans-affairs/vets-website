import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class CalendarRow extends Component {
  static propTypes = {
    getSelectedDateOptions: PropTypes.func,
    dates: PropTypes.array.isRequired,
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

  handleSelectOption = (fieldName, value) => {
    this.props.handleSelectOption({
      fieldName,
      value,
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
      currentlySelectedDate,
      selectedDates,
      getSelectedDateOptions,
    } = this.props;

    if (currentlySelectedDate && getSelectedDateOptions) {
      let showOptions = false;

      for (let index = 0; index < this.props.dates.length; index++) {
        const cell = this.props.dates[index];
        if (cell !== null) {
          if (this.isCurrentlySelected(cell)) {
            showOptions = true;
          }
        }
      }

      if (showOptions) {
        const additionalOptions = this.props.getSelectedDateOptions(
          currentlySelectedDate,
        );

        if (additionalOptions) {
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
                      selectedDates[currentlySelectedDate][fieldName] ===
                      o.value
                    }
                    onChange={e =>
                      this.handleSelectOption(fieldName, e.target.value)
                    }
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
    }

    return null;
  };

  render() {
    const { dates, rowNumber } = this.props;

    return (
      <div>
        <div className="vaos-calendar__calendar-week">
          {dates.map((date, index) => {
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
