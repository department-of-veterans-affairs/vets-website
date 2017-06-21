import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';

import CollapsiblePanel from '../../common/components/CollapsiblePanel';

class LetterList extends React.Component {
  render() {
    // Replace this with collapsible panels
    const letterItems = (this.props.letters || []).map((letter, index) => {
      return (
        <CollapsiblePanel panelName={letter.name} key={`collapsiblePanel-${index}`}>
          <p>Some content for each letter, need custom content still.</p>
          <Link to="/" target="_blank" className="usa-button-primary va-button-primary">
            Download Letter
          </Link>
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
  letters: PropTypes.array
};

export default LetterList;
