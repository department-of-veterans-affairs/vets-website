import React from 'react';
import Graph from './Graph';

class Outcomes extends React.Component {

  render() {
    const { retention, graduation, salary, repayment } = this.props.graphing;
    const download = {
      info: 'Excel | 14.4 MB',
      link: 'http://www.benefits.va.gov/gibill/docs/OutcomeMeasuresDashboard.xlsx'
    };
    return (
      <div className="outcomes row">
        <div className="medium-6 large-6 column">
          <h3>Retention rate</h3>
          <p className="lml">(<a onClick={this.props.showModal.bind(this, 'retention')}>Learn more</a>)</p>
          <Graph veterans={retention.rate} all={retention.all} average={retention.average}/>
        </div>

        <div className="medium-6 large-6 column">
          <h3>Graduation rate</h3>
          <p className="lml">(<a onClick={this.props.showModal.bind(this, 'gradrates')}>Learn more</a>)</p>
          <Graph veterans={graduation.rate} all={graduation.all} average={graduation.average}/>
        </div>

        <div className="medium-6 large-6 column">
          <h3>Average salaries</h3>
          <p className="lml">(<a onClick={this.props.showModal.bind(this, 'salaries')}>Learn more</a>)</p>
          <Graph decimals={0} max={100000} average={salary.average} all={salary.all}/>
        </div>

        <div className="medium-6 large-6 column">
          <h3>Repayment rate</h3>
          <p className="lml">(<a onClick={this.props.showModal.bind(this, 'repayment')}>Learn more</a>)</p>
          <Graph average={repayment.average} veterans={repayment.rate} all={repayment.all}/>
        </div>

        <div className="medium-12 column">
          <svg height="60">
            <g>
              <rect x="0" y="0" width="40" height="40" fill="#F1F1F1"/>
              <line x1="20" x2="20" y1="0" y2="40" stroke="#323A45" strokeWidth="2"/>
              <text x="50" y="30" fontFamily="SourceSansPro-Regular, Source Sans Pro" fontSize="22" fill="#323A45">
                <tspan>National average</tspan>
              </text>
            </g>
          </svg>
          <p>
            Access a comprehensive spreadsheet of <a title="Veteran Outcome Measures"
                href={download.link} target="_blank">Veteran Outcome Measures ({download.info})</a>
          </p>
        </div>
      </div>
    );
  }
}

Outcomes.propTypes = {
  graphing: React.PropTypes.shape({
    retention: React.PropTypes.shape({
      rate: React.PropTypes.number,
      all: React.PropTypes.number,
      average: React.PropTypes.number
    }),
    graduation: React.PropTypes.shape({
      rate: React.PropTypes.number,
      all: React.PropTypes.number,
      average: React.PropTypes.number
    }),
    salary: React.PropTypes.shape({
      all: React.PropTypes.number,
      average: React.PropTypes.number
    }),
    repayment: React.PropTypes.shape({
      rate: React.PropTypes.number,
      all: React.PropTypes.number,
      average: React.PropTypes.number
    }),
  }),
  showModal: React.PropTypes.func,
};

export default Outcomes;
