import React from 'react';

class RepaymentRates extends React.Component {

  render() {
    const school = this.props.institution;
    const heading = <h3>Repayment Rate<a onClick={() => {this.props.toggleModalDisplay('repayment');}} className="info-icons"><i className="fa fa-info-circle info-icons outcomes-learnmore"></i></a></h3>;
    // const graph = () => {
    //   return new Graph({
    //     target:  '#repayment-rates',
    //     bars:    [
    //       { name : 'vet', value : null },
    //       { name : 'all', value : (parseFloat(school.repaymentRateAllStudents) * 100)
    //     ],
    //     average: 67.9
    //   });
    // }
    if (school.salaryAllStudents) {
      return (
        <div className="medium-6 columns">
          {heading}
          <div id="repayment-rates" className="graph">
            <strong>Chart Goes Here</strong>
            <p>
              vet: null<br/>
              all: {(parseFloat(school.repaymentRateAllStudents) * 100)}<br/>
              average: 67.9
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="medium-6 columns">
        {heading}
        <p>Repayment Data Not Available</p>
      </div>
    );
  }

}

RepaymentRates.propTypes = {
  institution: React.PropTypes.object.isRequired,
  toggleModalDisplay: React.PropTypes.func.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

RepaymentRates.defaultProps = {
  expanded: true
};

export default RepaymentRates;
