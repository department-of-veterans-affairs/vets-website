import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';
import { reportTypes } from '../config';
import {
  changeDateOption,
  setDate,
  submitForm,
  toggleAllReports,
  toggleReportType,
} from '../actions/form';
import { openModal } from '../actions/modal';
import { apiRequest } from '../utils/helpers';

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderReportCheckBoxLabel = this.renderReportCheckBoxLabel.bind(this);
    this.renderInformationTypes = this.renderInformationTypes.bind(this);
    this.renderDateOptions = this.renderDateOptions.bind(this);

    this.state = {
      invalidStartDateFormat: false,
      invalidEndDateFormat: false
    };
  }

  componentDidMount() {
    // kick off PHR refresh process
    apiRequest('/v0/health_records/refresh');
  }

  componentWillReceiveProps(nextProps) {
    const redirect = this.props.form.ui.redirect;
    const nextRedirect = nextProps.form.ui.redirect;
    if (redirect !== nextRedirect && nextRedirect) {
      this.context.router.push('/download');
    }
  }

  handleStartDateChange(startDate) {
    this.props.setDate(startDate);
  }

  handleEndDateChange(endDate) {
    this.props.setDate(endDate ? endDate.endOf('day') : null, false);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitForm(this.props.form);
  }

  renderReportCheckBoxLabel(c) {
    let onClick;
    let hasGlossaryLink = false;
    let linkText;

    if (c.value === 'dodmilitaryservice') {
      hasGlossaryLink = true;
      linkText = '(Learn more)';

      onClick = (e) => {
        e.preventDefault();
        this.props.openModal('Military Service Information', (
          <div>
            You will have access to your:
            <ul>
              <li>Military Occupational Speciality (MOS) codes</li>
              <li>Pay details</li>
              <li>Service dates</li>
              <li>Deployment periods</li>
              <li>Retirement periods</li>
            </ul>
          </div>
        ));
      };
    } else if (c.hold) {
      hasGlossaryLink = true;
      linkText = `(Available after ${c.hold} days)`;
      onClick = (e) => {
        e.preventDefault();
        this.props.openModal(`Available after ${c.hold} days`, c.holdExplanation);
      };
    }

    if (hasGlossaryLink) {
      return (
        <span>
          {c.label} <a href="#" onClick={onClick}>
            {linkText}
          </a>
        </span>
      );
    }

    return c.label;
  }

  renderInformationTypes() {
    return Object.keys(reportTypes).map(k => {
      const rt = reportTypes[k];
      return (
        <div key={k} className="info-type-section">
          <h5>{rt.title}</h5>
          {rt.children.map(c => {
            const reportTypeOnChange = (checked) => {
              this.props.toggleReportType(c.value, checked);
            };
            return (
              <div key={c.value}>
                <ErrorableCheckbox
                    name={c.value}
                    label={this.renderReportCheckBoxLabel(c)}
                    checked={this.props.form.reportTypes[c.value]}
                    onValueChange={reportTypeOnChange}/>
              </div>
            );
          })}
        </div>
      );
    });
  }

  renderDateOptions() {
    const {
      dateOption,
      dateRange: {
        start: startDate,
        end: endDate
      }
    } = this.props.form;

    const handleFormattedDate = (start = true) => {
      let handleDateChange;
      let setInvalidDateState;

      if (start) {
        handleDateChange = this.handleStartDateChange;
        setInvalidDateState = () => this.setState({ invalidStartDateFormat: true });
      } else {
        handleDateChange = this.handleEndDateChange;
        setInvalidDateState = () => this.setState({ invalidEndDateFormat: true });
      }

      return (e) => {
        const dateString = e.target.value;
        const momentDate = moment(dateString);

        if (momentDate.isValid()) {
          handleDateChange(momentDate);
        } else {
          handleDateChange(null);
          if (dateString) {
            setInvalidDateState();
          }
        }
      };
    };

    const datePickerDisabled = dateOption !== 'custom';

    const customDateRangeError =
      this.state.invalidStartDateFormat ||
      this.state.invalidEndDateFormat;

    const customDateOptionClass = classNames({
      'custom-date-option': true,
      'date-range-error': customDateRangeError
    });

    const radioButtonProps = {
      name: 'dateRange',
      label: '',
      options: [
        { label: '3 months', value: '3mo' },
        { label: '6 months', value: '6mo' },
        { label: '1 year', value: '1yr' },
        {
          label: (
            <div className={customDateOptionClass}>
              {
                customDateRangeError && <p className="date-range-error">
                Enter dates in the MM/DD/YYYY date format</p>
              }
              <span>Custom date range</span>
              <div className="date-range-fields">
                <DatePicker
                    id="custom-date-start"
                    onBlur={handleFormattedDate()}
                    onChange={this.handleStartDateChange}
                    onFocus={() => this.setState({ invalidStartDateFormat: false })}
                    placeholderText="MM/DD/YYYY"
                    selected={startDate}
                    disabled={datePickerDisabled}
                    maxDate={endDate}
                    className={!datePickerDisabled && this.state.invalidStartDateFormat ? 'date-range-error' : ''}/>
                <span>&nbsp;to&nbsp;</span>
                <DatePicker
                    id="custom-date-end"
                    onBlur={handleFormattedDate(false)}
                    onChange={this.handleEndDateChange}
                    onFocus={() => this.setState({ invalidEndDateFormat: false })}
                    placeholderText="MM/DD/YYYY"
                    selected={endDate}
                    disabled={datePickerDisabled}
                    minDate={startDate}
                    className={!datePickerDisabled && this.state.invalidEndDateFormat ? 'date-range-error' : ''}/>
              </div>
            </div>
          ),
          value: 'custom'
        },
      ],
      onValueChange: (v) => {
        if (v.dirty) {
          this.props.changeDateOption(v.value);
          this.setState({
            invalidStartDateFormat: false,
            invalidEndDateFormat: false
          });
        }
      },
      value: {
        value: dateOption,
      }
    };

    return (
      <div>
        <h4 className="highlight">Select Date Range</h4>
        <ErrorableRadioButtons {...radioButtonProps}/>
      </div>
    );
  }

  render() {
    const selections = this.props.form.reportTypes;
    const types = Object.keys(selections);
    const checkedCount = _.countBy(types, type => selections[type]).true;
    const allValuesChecked = checkedCount === types.length;
    const noValuesChecked = !checkedCount;

    return (
      <div>
        <h1>Get Your VA Health Records</h1>
        <form>
          {this.renderDateOptions()}
          <div>
            <h4 className="highlight">Select Types of Information</h4>
            <ErrorableCheckbox
                name="all"
                label="Select all types of information"
                checked={allValuesChecked}
                onValueChange={(checked) => {
                  this.props.toggleAllReports(checked);
                }}/>
            {this.renderInformationTypes()}
          </div>
          <div className="form-actions">
            <button
                onClick={this.handleSubmit}
                type="submit"
                disabled={noValuesChecked}>
              Submit
            </button>
            <a className="usa-button usa-button-outline" href="/healthcare" role="button">Cancel</a>
          </div>
        </form>
      </div>
    );
  }
}

Main.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  const hrState = state.health.hr;

  return {
    form: hrState.form,
  };
};

const mapDispatchToProps = {
  changeDateOption,
  openModal,
  setDate,
  submitForm,
  toggleAllReports,
  toggleReportType,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
