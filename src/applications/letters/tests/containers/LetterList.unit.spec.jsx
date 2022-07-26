import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { LetterList } from '../../containers/LetterList';
import { AVAILABILITY_STATUSES } from '../../utils/constants';

const defaultProps = {
  letters: [
    {
      name: 'Commissary Letter',
      letterType: 'commissary',
    },
    {
      name: 'Benefit Summary and Service Verification Letter',
      letterType: 'benefit_summary',
    },
    {
      name: 'Benefit Verification Letter',
      letterType: 'benefit_verification',
    },
  ],
  lettersAvailability: AVAILABILITY_STATUSES.available,
  letterDownloadStatus: {},
  optionsAvailable: true,
};

describe('<LetterList>', () => {
  it('renders', () => {
    const tree = SkinDeep.shallowRender(<LetterList {...defaultProps} />);
    expect(tree.type).to.equal('div');
  });

  it('renders an accordion for each letter', () => {
    const tree = SkinDeep.shallowRender(<LetterList {...defaultProps} />);
    const accordions = tree.everySubTree('va-accordion-item');
    expect(accordions.length).to.equal(3);
  });

  it('passes the right title prop for each panel', () => {
    const component = SkinDeep.shallowRender(<LetterList {...defaultProps} />);
    const panels = component.everySubTree('va-accordion-item');
    defaultProps.letters.forEach((letter, index) => {
      const letterProps = panels[index].dive(['h3']).text();
      expect(letterProps).to.contain(defaultProps.letters[index].name);
    });
  });

  it('renders DL buttons for all letters in list', () => {
    const component = SkinDeep.shallowRender(<LetterList {...defaultProps} />);

    const checkButtonInPanel = panel => {
      expect(panel.text()).to.contain('Connect(DownloadLetterLink)');
    };

    component.everySubTree('va-accordion-item').forEach(checkButtonInPanel);
  });

  it('does not render DL button for BSL if !optionsAvailable', () => {
    const assertButtonUndefined = panelText => {
      expect(panelText).to.not.contain('Connect(DownloadLetterLink)');
    };

    const isBSL = panelText => panelText.includes(defaultProps.letters[1].name);
    const props = { ...defaultProps, optionsAvailable: false };
    const component = SkinDeep.shallowRender(<LetterList {...props} />);

    component
      .everySubTree('va-accordion-item')
      .map(panel => panel.text())
      .filter(isBSL)
      .forEach(assertButtonUndefined);
  });

  it('renders DL button for non-benefit-summary letters if !optionsAvailable', () => {
    const checkButtonInPanel = panelText => {
      expect(panelText).to.includes('Connect(DownloadLetterLink)');
    };

    const isNotBSL = panelText =>
      !panelText.includes(defaultProps.letters[1].name);

    const props = { ...defaultProps, optionsAvailable: false };
    const component = SkinDeep.shallowRender(<LetterList {...props} />);

    component
      .everySubTree('va-accordion-item')
      .map(panel => panel.text())
      .filter(isNotBSL)
      .forEach(checkButtonInPanel);
  });

  it('renders eligibility error when letters not available', () => {
    const props = {
      ...defaultProps,
      lettersAvailability: AVAILABILITY_STATUSES.letterEligibilityError,
    };
    const component = SkinDeep.shallowRender(<LetterList {...props} />);
    const eligibilityMessage = component.subTree('va-alert').dive(['p']).props;
    expect(eligibilityMessage.children).to.contain(
      'One of our systems appears to be down.',
    );
  });
});
