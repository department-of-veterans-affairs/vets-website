import React from 'react';

class GraduationRates extends React.Component {

  render() {
    const school = this.props.institution;
    const isNumeric = (n) => { return !Number.isNaN(parseFloat(n)); };
    const isaV = isNumeric(school.graduation_rate_veteran);
    const isaC = isNumeric(school.graduation_rate_all_students);
    const heading = <h3>Graduation Rate<a onClick={() => {this.props.toggleModalDisplay('gradrates');}} className="info-icons"><i className="fa fa-info-circle info-icons outcomes-learnmore"></i></a></h3>;

    if (isaV || isaC) {
      const vrate = isaV ? (parseFloat(school.graduation_rate_veteran) * 100) : 'null';
      const crate = isaC ? (parseFloat(school.graduation_rate_all_students) * 100) : 'null';
      // const graph = () => {
      //   return new Graph({
      //     target: '#grad-rates',
      //     bars: [
      //       { name: 'vet', value: vrate },
      //       { name: 'all', value: crate }
      //     ],
      //     average : 42.3
      //   });
      // }
      return (
        <div className="medium-6 columns">
          {heading}
          <div id="grad-rates" className="graph">
            <strong>Chart Goes Here</strong>
            <p>
              vrate: {vrate}<br/>
              crate: {crate}<br/>
              average: 42.3
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="medium-6 columns">
        {heading}
        <p>Grad Data Not Available</p>
      </div>
    );
  }

}

GraduationRates.propTypes = {
  institution: React.PropTypes.object.isRequired,
  toggleModalDisplay: React.PropTypes.func.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

GraduationRates.defaultProps = {
  expanded: true
};

export default GraduationRates;
