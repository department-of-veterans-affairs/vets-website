import React from 'react';

export default class EducationHistoryReview extends React.Component {
  render() {
    const completionDate = this.props.data.highSchoolOrGedCompletionDate;
    const { day, month, year } = completionDate;
    return (
      <div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>If you received a high school diploma or high school equivalency certificate, what date was it received? (month, day, year)</td>
              <td>{month.value ? `${month.value}/${day.value}/${year.value}` : null}</td>
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
                <td scope="col">City></td>
                <td scope="col">{period.city.value}</td>
              </tr>
              <tr>
                <td scope="col">State</td>
                <td>{period.state.value}</td>
              </tr>
            </tbody>
          </table>
          );
        })}
      </div>
    );
  }
}

EducationHistoryReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
