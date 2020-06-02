import React from 'react';
import last from 'lodash/last';
import moment from 'moment';
import ExpandingGroup from '@department-of-veterans-affairs/formation-react/ExpandingGroup';
import { deductionCodes } from '../const';

class DebtLetterCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panelOpen: false,
    };
  }
  render() {
    const { debt } = this.props;
    const mostRecentHistory = last(debt.debtHistory);
    return (
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--1">
        <h4 className="vads-u-margin--0">
          {deductionCodes[debt.deductionCode]}
        </h4>
        <p>
          <strong>Status:</strong> {mostRecentHistory.status}
        </p>
        <p>
          <strong>Last updated:</strong>{' '}
          {moment(mostRecentHistory.date).format('MMMM D, YYYY')}
        </p>
        <button
          onClick={() => {
            this.setState({
              panelOpen: !this.state.panelOpen,
            });
          }}
        >
          View History
        </button>

        <ExpandingGroup open={this.state.panelOpen}>
          {this.state.panelOpen && <h5>Debt History:</h5>}
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            {debt.debtHistory.map((debtEntry, index) => (
              <div
                className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--1p5"
                key={`${debtEntry.letterCode}-${index}`}
              >
                <span>{debtEntry.date}</span>
                <span>{debtEntry.status}</span>
                <span>{debtEntry.description}</span>
              </div>
            ))}
          </div>
        </ExpandingGroup>
      </div>
    );
  }
}

export default DebtLetterCard;
