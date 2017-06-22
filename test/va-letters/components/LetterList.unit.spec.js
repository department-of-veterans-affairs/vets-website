import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import LetterList from '../../../src/js/va-letters/components/LetterList.jsx';

const defaultProps = {
  letters: [
    {
      letterName: 'Commissary Letter',
      letterType: 'commissary'
    },
    {
      letterName: 'Benefit Summary Letter',
      letterType: 'benefit_summary'
    },
    {
      letterName: 'Benefit Verification Letter',
      letterType: 'benefit_verification'
    }
  ]
};

describe('<LetterList>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<LetterList {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
  // Add tests for collapsible panel headers, toggling, and empty letter list messaging.
});
