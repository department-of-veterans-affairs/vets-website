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

    if (this.props.lettersAvailable) {
      appContent = this.props.children;
    } else if (this.props.lettersAvailable === undefined) {
      appContent = <LoadingIndicator message="Loading your application..."/>;
    } else {
      appContent = <div>Warning message: need content for when fetch of data from vets-api fails</div>;
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
    lettersAvailable: letterState.lettersAvailable,
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
