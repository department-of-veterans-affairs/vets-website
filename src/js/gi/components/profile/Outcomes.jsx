import React from 'react';
import { connect } from 'react-redux';
import { showModal } from '../../actions';
import { outcomeNumbers } from '../../selectors/outcomes';
import Graph from './Graph';

export class Outcomes extends React.Component {

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
          <p>
            Access a comprehensive spreadsheet of <a title="Veteran Outcome Measures"
                href={download.link} target="_blank">Veteran Outcome Measures ({download.info})</a>
          </p>
        </div>
      </div>
    );
  }
}
// const mapStateToProps = (state, props) => state;

const mapStateToProps = (state, props) => {
  return {
    graphing: outcomeNumbers(state, props)
  };
};

const mapDispatchToProps = {
  showModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Outcomes);
