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
        return additionalOptions?.options.map((o, index) => (
          <div key={`radio-${index}`}>
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
            <label htmlFor={`radio-${index}`}>{o.label}</label>
          </div>
        ));
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
          {cells.map((c, index) => {
            if (c === null) {
              return (
                <button
                  key={`row-${rowNumber}-cell-${index}`}
                  className="vaos-calendar__calendar-day vads-u-visibility--hidden"
                />
              );
            }

            const cssClasses = [
              'vaos-calendar__calendar-day',
              'vads-u-color--base',
              'vads-u-background-color--gray-lightest',
              'vads-u-border--1px',
              'vads-u-border-color--base',
              'vads-u-padding-y--1p5',
              'vads-u-font-weight--bold',
              'vads-u-margin-y--1',
            ];

            if (this.isCurrentlySelected(c))
              cssClasses.push('vaos-calendar__cell-current');

            if (this.isInSelectedMap(c))
              cssClasses.push('vaos-calendar__cell-selected');

            return (
              <button
                key={`row-${rowNumber}-cell-${index}`}
                className={cssClasses.join(' ')}
                onClick={() => this.handleSelectDate(c)}
              >
                {moment(c).format('D')}
              </button>
            );
          })}
        </div>
        <div className="vaos-calendar__options">{this.renderOptions()}</div>
      </div>
    );
  }
}
