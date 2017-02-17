import React from 'react';
import { connect } from 'react-redux';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';
import DatePicker from 'react-datepicker';
import { reportTypes } from '../config';
import _ from 'lodash';
import {
  changeDateOption,
  setDate,
  submitForm,
  toggleAllReports,
  toggleReportType,
} from '../actions/form';
import { openModal } from '../actions/modal';
import { apiRequest } from '../utils/helpers';

function isValidDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return true;
  }
  return startDate.isBefore(endDate);
}

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invalidStartDate: false,
      invalidEndDate: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
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
    let invalidDate = true;
    if (isValidDateRange(startDate, this.props.form.dateRange.end)) {
      this.props.setDate(startDate, true);
      invalidDate = false;
    }
    this.setState({ invalidStartDate: invalidDate });
  }

  handleEndDateChange(endDate) {
    let invalidDate = true;
    if (isValidDateRange(this.props.form.dateRange.start, endDate)) {
      this.props.setDate(endDate, false);
      invalidDate = false;
    }
    this.setState({ invalidEndDate: invalidDate });
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
    const datePickerDisabled = this.props.form.dateOption !== 'custom';
    const radioButtonProps = {
      name: 'dateRange',
      label: '',
      options: [
        { label: '3 months', value: '3mo' },
        { label: '6 months', value: '6mo' },
        { label: '1 year', value: '1yr' },
        {
          label: (
            <div>
              <span>Custom date range<br/></span>
              <div className="date-range-fields">
                <DatePicker
                    id="custom-date-start"
                    onChange={this.handleStartDateChange}
                    placeholderText="MM/DD/YYYY"
                    selected={this.props.form.dateRange.start}
                    disabled={datePickerDisabled}
                    className={this.state.invalidStartDate ? 'date-range-error' : ''}/>
                <span>&nbsp;to&nbsp;</span>
                <DatePicker
                    id="custom-date-end"
                    onChange={this.handleEndDateChange}
                    placeholderText="MM/DD/YYYY"
                    selected={this.props.form.dateRange.end}
                    disabled={datePickerDisabled}
                    className={this.state.invalidEndDate ? 'date-range-error' : ''}/>
              </div>
            </div>
          ),
          value: 'custom'
        },
      ],
      onValueChange: (v) => {
        if (v.dirty) {
          this.props.changeDateOption(v.value);
        }
      },
      value: {
        value: this.props.form.dateOption,
      }
    };

    return (
      <div>
        <h4 className="highlight">Select Date Range</h4>
        <ErrorableRadioButtons
            {...radioButtonProps}/>
      </div>
    );
  }

  render() {
    const allValuesChecked = _.every(_.values(this.props.form.reportTypes), v => v);

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
            <button onClick={this.handleSubmit} type="submit">Submit</button>
            <a href="/healthcare">
              <button className="usa-button-outline">
                  Cancel
              </button>
            </a>
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
  const bbState = state.health.bb;

  return {
    form: bbState.form,
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
