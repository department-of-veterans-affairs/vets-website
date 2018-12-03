import React from 'react';

export default class SummaryDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      houseAssistance: false,
      carAssistance: false,
      aidAndAttendance: false,
      individualUnemployability: false,
    };
  }

  handleCheckbox = assistanceKey => event =>
    this.setState({ [assistanceKey]: event.target.checked });

  render() {
    const assistanceNeeded = {
      houseAssistance: this.props.formData['view:modifyingHome']
        ? 'Adapted housing assistance'
        : null,
      carAssistance: this.props.formData['view:modifyingCar']
        ? 'Automobile allowance'
        : null,
      aidAndAttendance: this.props.formData['view:aidAndAttendance']
        ? 'Aid and Attendance'
        : null,
      individualUnemployability: this.props.formData['view:unemployable']
        ? 'Individual Unemployability'
        : null,
    };

    return (
      <div>
        <p>
          Based on what you told us, you may be eligible for these additional
          disability benefits.
        </p>
        {Object.keys(assistanceNeeded)
          .filter(key => assistanceNeeded[key])
          .map(key => (
            <div key={key}>
              <input
                type="checkbox"
                id={`assistanceNeeded-${key}`}
                value={key}
                onChange={this.handleCheckbox(key)}
                checked={this.state[key]}
              />
              <label htmlFor={`assistanceNeeded-${key}`}>
                {assistanceNeeded[key]}
              </label>
            </div>
          ))}
        {this.state.houseAssistance && (
          <div>
            <p>
              To apply for an adapted housing grant, you’ll need to fill out an
              Application in Acquiring Specially Adapted Housing or Special Home
              Adaptation Grant (VA Form 26-4555).
            </p>
            <p>
              <a href="https://www.vba.va.gov/pubs/forms/vba-26-4555-are.pdf">
                Download VA Form 26-4555
              </a>
              .
            </p>
          </div>
        )}
        {this.state.carAssistance && (
          <div>
            <p>
              To file a claim for a one-time payment to help you buy a specially
              equipped vehicle, you’ll need to fill out an Application for
              Automobile or Other Conveyance and Adaptive Equipment (VA Form
              21-4502).
              <div>
                <a href="https://www.vba.va.gov/pubs/forms/VBA-21-4502-ARE.pdf">
                  Download VA Form 21-4502
                </a>
                .
              </div>
            </p>
            <p>
              To file a claim for adaptive equipment, you’ll need to fill out an
              Application for Adaptive Equipment—Motor Vehicle (VA Form
              10-1394).
              <div>
                <a href="https://www.va.gov/vaforms/medical/pdf/10-1394-fill.pdf">
                  Download VA Form 10-1394.
                </a>
              </div>
            </p>
          </div>
        )}
        {this.state.aidAndAttendance && (
          <div>
            <p>
              To apply for Aid and Attendance benefits, you'll need to turn in
              an Examination for Housebound Status or Permanent Need for Regular
              Aid and Attendance (VA Form 21-2680), which your doctor needs to
              fill out.
            </p>
            <div>
              <a href="https://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf">
                Download VA Form 21-2680
              </a>
              .
            </div>
          </div>
        )}
        {this.state.individualUnemployability && (
          <div>
            <p>
              To file a claim for Individual Unemployability, you’ll need to
              fill out:
            </p>
            <p>
              A Veteran’s Application for Increased Compensation Based on
              Unemployability (VA Form 21-8940)
              <div>
                <a href="https://www.vba.va.gov/pubs/forms/vba-21-8940-are.pdf">
                  Download VA Form 21-8940
                </a>
                , <strong>and</strong>
              </div>
            </p>
            <p>
              A Request for Employment Information in Connection with Claim for
              Disability Benefits (VA Form 21-4192)
              <div>
                <a href="https://www.vba.va.gov/pubs/forms/VBA-21-4192-ARE.pdf">
                  Download VA Form 21-4192
                </a>
                .
              </div>
            </p>
          </div>
        )}
      </div>
    );
  }
}
