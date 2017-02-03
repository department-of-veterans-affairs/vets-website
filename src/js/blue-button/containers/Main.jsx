import React from 'react';
import { connect } from 'react-redux';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';
import DatePicker from 'react-datepicker';
import { reportTypes } from '../config';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  handleStartDateChange() {

  }

  handleEndDateChange() {

  }

  handleSubmit(e) {
    e.preventDefault();

    this.context.router.push('/download');
  }

  renderInformationTypes() {
    return Object.keys(reportTypes).map(k => {
      const rt = reportTypes[k];
      return (
        <div key={k} className="info-type-section">
          <h5>{rt.title}</h5>
          {rt.children.map(c => {
            return (
              <div key={c.value}>
                <ErrorableCheckbox
                    name={c.value}
                    label={c.label}
                    onValueChange={() => {}}/>
              </div>
            );
          })}
        </div>
      );
    });
  }

  render() {
    // TODO: clean this up and hook up to action/reducer
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
                    selected={null}/>
                <span>&nbsp;to&nbsp;</span>
                <DatePicker
                    id="custom-date-end"
                    onChange={this.handleEndDateChange}
                    placeholderText="MM/DD/YYYY"
                    selected={null}/>
              </div>
            </div>
          ),
          value: 'custom'
        },
      ],
      onValueChange: () => {},
      value: {
        value: 'UPDATEME',
      }
    };

    return (
      <div>
        <h1>Get Your VA Health Records</h1>
        <form>
          <div>
            <h4 className="highlight">Select Date Range</h4>
            <ErrorableRadioButtons
                {...radioButtonProps}/>
          </div>
          <div>
            <h4 className="highlight">Select Types of Information</h4>
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

const mapStateToProps = (state) => state;

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
