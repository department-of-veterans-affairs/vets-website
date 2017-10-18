import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { LetterList } from '../../../src/js/letters/containers/LetterList.jsx';
import { AVAILABILITY_STATUSES } from '../../../src/js/letters/utils/constants';

const defaultProps = {
  letters: [
    {
      name: 'Commissary Letter',
      letterType: 'commissary'
    },
    {
      name: 'Benefit Summary and Service Verification Letter',
      letterType: 'benefit_summary'
    },
    {
      name: 'Benefit Verification Letter',
      letterType: 'benefit_verification'
    }
  ],
  lettersAvailability: AVAILABILITY_STATUSES.available,
  letterDownloadStatus: {},
  optionsAvailable: true,
};

describe('<LetterList>', () => {
  it('renders', () => {
    const tree = SkinDeep.shallowRender(<LetterList {...defaultProps}/>);
    expect(tree.type).to.equal('div');
  });

  it('renders collapsible panels for each letter', () => {
    const tree = SkinDeep.shallowRender(<LetterList {...defaultProps}/>);
    const collapsibles = tree.everySubTree('CollapsiblePanel');
    expect(collapsibles.length).to.equal(3);
  });

  it('passes the right title prop for each panel', () => {
    const component = SkinDeep.shallowRender(<LetterList {...defaultProps}/>);
    const panels = component.everySubTree('CollapsiblePanel');
    defaultProps.letters.forEach((letter, index) => {
      const letterProps = panels[index].props;
      expect(letterProps.panelName).to.equal(defaultProps.letters[index].name);
    });
  });

  it('renders eligibility error when letters not available', () => {
    const props = { ...defaultProps, lettersAvailability: AVAILABILITY_STATUSES.letterEligibilityError };
    const component = SkinDeep.shallowRender(<LetterList {...props}/>);
    const eligibilityMessage = component.subTree('.usa-alert-text').text();
    expect(eligibilityMessage).to.contain('One of our systems appears to be down.');
  });

});
