import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import LetterList from '../../../src/js/letters/components/LetterList.jsx';

const defaultProps = {
  letters: [
    {
      name: 'Commissary Letter',
      letterType: 'commissary'
    },
    {
      name: 'Benefit Summary Letter',
      letterType: 'benefit_summary'
    },
    {
      name: 'Benefit Verification Letter',
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

  it('should show collapsible panels for all letters', () => {
    const tree = SkinDeep.shallowRender(<LetterList {...defaultProps}/>);
    const collapsibles = tree.everySubTree('CollapsiblePanel');
    expect(collapsibles.length).to.equal(3);
  });
});
