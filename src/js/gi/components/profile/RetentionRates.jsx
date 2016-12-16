import React from 'react';

class RetentionRates extends React.Component {

  render() {
    const school = this.props.institution;
    const heading = <h3>Retention Rate<a onClick={() => {this.props.toggleModalDisplay('retention');}} className="info-icons"><i className="fa fa-info-circle info-icons outcomes-learnmore"></i></a></h3>;
    const isNumeric = (n) => { return !Number.isNaN(parseFloat(n)); };
    const isaV = isNumeric(school.getVeteranRetentionRate);
    const isaC = isNumeric(school.getAllStudentRetentionRate);

    if (isaV || isaC) {
      const vrate = isaV ? (parseFloat(school.getVeteranRetentionRate) * 100) : 'null';
      const crate = isaC ? (parseFloat(school.getAllStudentRetentionRate) * 100) : 'null';
      // const graph = () => {
      //   return new Graph({
      //     target: '#retention-rates',
      //     bars: [
      //       { name: 'vet', value: vrate },
      //       { name: 'all', value: crate }
      //     ],
      //     average : 67.7
      //   });
      // }
      return (
        <div className="medium-6 columns">
          {heading}
          <div id="retention-rates" className="graph">
            <strong>Chart Goes Here</strong>
            <p>
              vrate: {vrate}<br/>
              crate: {crate}<br/>
              average: 67.7
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="medium-6 columns">
        {heading}
        <p>Retention Rate Data Not Available</p>
      </div>
    );
  }

}

RetentionRates.propTypes = {
  institution: React.PropTypes.object.isRequired,
  toggleModalDisplay: React.PropTypes.func.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

RetentionRates.defaultProps = {
  expanded: true
};

export default RetentionRates;
