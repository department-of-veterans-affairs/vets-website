import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

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

// Ensure the Toggler is set to false
const getStore = (lettersPageNewDesign = false) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      letters_page_new_design: lettersPageNewDesign,
    },
  }));

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

  it('[TOGGLER OFF]: renders DL buttons for all letters in list', () => {
    const component = SkinDeep.shallowRender(
      <Provider store={getStore()}>
        <LetterList {...defaultProps} />
      </Provider>,
    );

    const checkButtonInPanel = panel => {
      expect(panel.text()).to.contain('Connect(DownloadLetterLink)');
    };

    component.everySubTree('va-accordion-item').forEach(checkButtonInPanel);
  });

  it('[TOGGLER ON]: renders DL links for all letters except BSL in list', () => {
    const assertHocRendered = panel => {
      expect(panel.subTree('Hoc')).to.exist; // Not exact, but shows the Toggler is rendered
    };

    const isNotBSL = panel => {
      const panelText = panel.text();
      return !panelText.includes(defaultProps.letters[1].name);
    };
    const component = SkinDeep.shallowRender(<LetterList {...defaultProps} />);

    component
      .everySubTree('va-accordion-item')
      .map(panel => panel)
      .filter(isNotBSL)
      .forEach(assertHocRendered);
  });

  // We want to test BSL logic for both toggler states because it (BSL) isn't
  // changing until the second phase of the new design
  it('[TOGGLER OFF]: does not render DL link for BSL if !optionsAvailable', () => {
    const assertButtonUndefined = panelText => {
      expect(panelText).to.not.contain('Connect(DownloadLetterLink)');
    };

    const isBSL = panelText => panelText.includes(defaultProps.letters[1].name);
    const props = { ...defaultProps, optionsAvailable: false };
    const component = SkinDeep.shallowRender(
      <Provider store={getStore()}>
        <LetterList {...props} />
      </Provider>,
    );

    component
      .everySubTree('va-accordion-item')
      .map(panel => panel.text())
      .filter(isBSL)
      .forEach(assertButtonUndefined);
  });

  it('[TOGGLER ON]: does not render DL link for BSL if !optionsAvailable', () => {
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

  it('[TOGGLER OFF]: renders DL button for non-benefit-summary letters if !optionsAvailable', () => {
    const checkButtonInPanel = panelText => {
      expect(panelText).to.includes('Connect(DownloadLetterLink)');
    };

    const isNotBSL = panelText =>
      !panelText.includes(defaultProps.letters[1].name);

    const props = { ...defaultProps, optionsAvailable: false };
    const component = SkinDeep.shallowRender(
      <Provider store={getStore()}>
        <LetterList {...props} />
      </Provider>,
    );

    component
      .everySubTree('va-accordion-item')
      .map(panel => panel.text())
      .filter(isNotBSL)
      .forEach(checkButtonInPanel);
  });

  it('[TOGGLER ON]: renders DL link for non-benefit-summary letters if !optionsAvailable', () => {
    const checkButtonLink = panelText => {
      expect(panelText).to.includes('Letter');
    };

    const isNotBSL = panelText =>
      !panelText.includes(defaultProps.letters[1].name);

    const props = { ...defaultProps, optionsAvailable: false };
    const component = SkinDeep.shallowRender(<LetterList {...props} />);

    component
      .everySubTree('va-accordion-item')
      .map(panel => panel.text())
      .filter(isNotBSL)
      .forEach(checkButtonLink);
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
