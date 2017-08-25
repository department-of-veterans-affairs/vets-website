import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import LetterList from '../../../src/js/letters/containers/LetterList.jsx';

import reducer from '../../../src/js/letters/reducers/index.js';
import createCommonStore from '../../../src/js/common/store';

const store = createCommonStore(reducer);
const defaultProps = store.getState();
defaultProps.letters = {
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
  ],
  letterDownloadStatus: {}
};

describe('<LetterList>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<LetterList store={store} {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should show collapsible panels for all letters', () => {
    const tree = SkinDeep.shallowRender(<LetterList store={store} {...defaultProps}/>);
    const collapsibles = tree.everySubTree('CollapsiblePanel');
    expect(collapsibles.length).to.equal(3);
  });
});
