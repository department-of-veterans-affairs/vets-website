import React from 'react';

class RetentionRates extends React.Component {

  render() {
    const school = this.props.institution;
    const isNumeric = (n) => { return Number.isNaN(parseFloat(n)) }
    const isa_v = isNumeric(school.get_veteran_retention_rate);
    const isa_c = isNumeric(school.get_all_student_retention_rate);

    if (isa_v || isa_c) {
      const vrate = isa_v ? (parseFloat(school.get_veteran_retention_rate) * 100) : 'null';
      const crate = isa_c ? (parseFloat(school.get_all_student_retention_rate) * 100) : 'null';
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
          <h4>Retention Rate<a onClick={() => {this.props.toggleModalDisplay('retention')}} className="info-icons"><i id="retention-rate-info" className="fa fa-info-circle info-icons outcomes-learnmore"></i></a></h4>
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
