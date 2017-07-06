import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../../common/components/LoadingIndicator';

import { getBenefitSummaryOptions, getLetterList } from '../actions/letters';

class Main extends React.Component {
  componentDidMount() {
    this.props.getLetterList();
    this.props.getBenefitSummaryOptions();
  }

  render() {
    let appContent;

    if (this.props.lettersAvailability === 'available') {
      appContent = this.props.children;
    } else if (this.props.lettersAvailability === 'awaitingResponse') {
      appContent = <LoadingIndicator message="Loading your letters..."/>;
    } else if (this.props.lettersAvailability === 'unavailable') {
      appContent = (
        <div>
          <div className="usa-alert usa-alert-error" role="alert">
            <div className="usa-alert-body">
              <h4 className="usa-alert-heading">Letters Unavailable</h4>
              <p className="usa-alert-text">
                We weren't able to retrieve your VA letters. Please call
                1-855-574-7286 between Monday-Friday 8:00 a.m. - 8:00 p.m. (ET).
              </p>
            </div>
          </div>
          <br/>
        </div>
      );
    }

    return (
      <div className="letters">
        {appContent}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const letterState = state.letters;
  return {
    letters: letterState.letters,
    destination: letterState.destination,
    lettersAvailability: letterState.lettersAvailability,
    benefitSummaryOptions: {
      benefitInfo: letterState.benefitInfo,
      serviceInfo: letterState.serviceInfo
    },
    optionsAvailable: letterState.optionsAvailable
  };
}

const mapDispatchToProps = {
  getBenefitSummaryOptions,
  getLetterList
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
