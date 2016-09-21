import React from 'react';
import { displayDateIfValid } from '../../utils/helpers.js';

export default class EducationHistoryReview extends React.Component {
  render() {
    const { completionDate, faaFlightCertificatesInformation } = this.props.data;
    return (
      <div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>If you received a high school diploma or high school equivalency certificate, what date was it received? (month, day, year)</td>
              <td>{displayDateIfValid(completionDate)}</td>
            </tr>
          </tbody>
        </table>
        {this.props.data.postHighSchoolTrainings.map((period, index) => {
          return (<table key={index} className="review usa-table-borderless">
            <thead>
              <tr>
                <td scope="col">Name of college or other training provider></td>
                <td scope="col">{period.name.value}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td scope="col">City</td>
                <td scope="col">{period.city.value}</td>
              </tr>
              <tr>
                <td scope="col">State</td>
                <td scope="col">{period.state.value}</td>
              </tr>
              <tr>
                <td scope="col">From</td>
                <td scope="col">{displayDateIfValid(period.fromDate)}</td>
              </tr>
              <tr>
                <td scope="col">To</td>
                <td scope="col">{displayDateIfValid(period.toDate)}</td>
              </tr>
              <tr>
                <td scope="col">Hours</td>
                <td scope="col">{period.hours.value}</td>
              </tr>
              <tr>
                <td scope="col">Type of hours</td>
                <td scope="col">{period.hoursType.value}</td>
              </tr>
              <tr>
                <td scope="col">Degree, diploma or certificate received</td>
                <td scope="col">{period.degreeReceived.value}</td>
              </tr>
            </tbody>
          </table>
          );
        })}
        <table className="review usa-table-borderless">
          <thead>
            <tr>
              <td scope="col">FAA certificates</td>
              <td scope="col"></td>
            </tr>
          </thead>
          <tbody>
          {faaFlightCertificatesInformation.map((cert, index) => {
            return (<tr key={index}>
              <td>{cert.name.value}</td>
              <td></td>
            </tr>);
          })}
          </tbody>
        </table>
      </div>
    );
  }
}

EducationHistoryReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
