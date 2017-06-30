import React from 'react';
import { connect } from 'react-redux';

import { getBenefitSummaryOptions, getLetterList } from '../actions/letters';

class Main extends React.Component {
  componentDidMount() {
    this.props.getLetterList();
    this.props.getBenefitSummaryOptions();
  }

  render() {
    return (
      <div className="letters">
        {this.props.children}
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
