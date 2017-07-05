import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import CollapsiblePanel from '../../common/components/CollapsiblePanel';
import DownloadLetterLink from './DownloadLetterLink';
import VeteranBenefitSummaryLetter from '../containers/VeteranBenefitSummaryLetter';

import { letterContent } from '../utils/helpers';

class LetterList extends React.Component {
  render() {
    // Hard-coding a few extra letters for usability testing purposes. Revert after testing.
    // const letterItems = (this.props.letters || []).map((letter, index) => {
    let letters = this.props.letters;
    if (_.findIndex({ letterType: 'medicare_partd' }, letters) < 0) {
      letters = _.concat(letters, [{
        name: 'Proof of Creditable Prescription Drug Coverage Letter',
        letterType: 'medicare_partd'
      }]
      );
    }
    if (_.findIndex({ letterType: 'minimum_essential_coverage' }, letters) < 0) {
      letters = _.concat(letters, [{
        name: 'Proof of Minimum Essential Coverage Letter',
        letterType: 'minimum_essential_coverage'
      }]
      );
    }
    const letterItems = (letters).map((letter, index) => {
      let content;

      if (letter.letterType === 'benefit_summary') {
        content = (<VeteranBenefitSummaryLetter/>);
      } else {
        content = letterContent[letter.letterType] || '';
      }

      return (
        <CollapsiblePanel
            panelName={letter.name}
            key={`collapsiblePanel-${index}`}>
          <div>{content}</div>
          <DownloadLetterLink
              letterType={letter.letterType}
              letterName={letter.name}
              key={`download-link-${index}`}/>
        </CollapsiblePanel>
      );
    });
    return (
      <div className="step-content">
        <p>
          To see what is included in each letter and how it can be used, expand the box
          using the (+). Then, download the letter.
        </p>
        {letterItems}
      </div>
    );
  }
}

LetterList.PropTypes = {
  letters: PropTypes.array,
  benefitSummaryOptions: PropTypes.object
};

export default LetterList;
