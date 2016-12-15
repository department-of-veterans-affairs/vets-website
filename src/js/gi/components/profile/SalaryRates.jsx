import React from 'react';

class SalaryRates extends React.Component {

  render() {
    const school = this.props.institution;
    const heading = <h3>Average Salaries<a onClick={() => {this.props.toggleModalDisplay('salaries');}} className="info-icons"><i className="fa fa-info-circle info-icons outcomes-learnmore"></i></a></h3>;
    // const graph = () => {
    //   return new Graph({
    //     target:  '#salary-rates',
    //     bars:    [
    //       { name : 'vet', value : <%= "null" %> },
    //       { name : 'all', value : <%= @school.salary_all_students %> }
    //     ],
    //     max: 100000,
    //     average: 33400
    //   });
    // }
    if (school.salary_all_students) {
      return (
        <div className="medium-6 columns">
          {heading}
          <div id="salary-rates" className="graph">
            <strong>Chart Goes Here</strong>
            <p>
              vet: null<br/>
              all: {school.salary_all_students}<br/>
              max: 100000<br/>
              average: 33400
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="medium-6 columns">
        {heading}
        <p>Salary Data Not Available</p>
      </div>
    );
  }

}

SalaryRates.propTypes = {
  institution: React.PropTypes.object.isRequired,
  toggleModalDisplay: React.PropTypes.func.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

SalaryRates.defaultProps = {
  expanded: true
};

export default SalaryRates;
