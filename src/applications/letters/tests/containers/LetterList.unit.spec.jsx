import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import * as focusUtils from '~/platform/utilities/ui/focus';
import { LetterList } from '../../containers/LetterList';
import {
  AVAILABILITY_STATUSES,
  DOWNLOAD_STATUSES,
} from '../../utils/constants';

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
    letters: {
      optionsAvailable: true,
      requestOptions: {},
      benefitInfo: {
        serviceConnectedPercentage: 60,
        awardEffectiveDate: '2021-12-01T00:00:00Z',
        monthlyAwardAmount: 1288.03,
        hasServiceConnectedDisabilities: true,
      },
      serviceInfo: [
        {
          branch: 'Army',
          characterOfService: 'HONORABLE',
          enteredDate: '1977-08-30T00:00:00Z',
          releasedDate: '1984-12-12T00:00:00Z',
        },
      ],
      enhancedLetterStatus: {
        [defaultProps.letterType]: DOWNLOAD_STATUSES.downloading,
      },
    },
    shouldUseLighthouse: true,
  }));

describe('<LetterList>', () => {
  describe('focus setting tests', () => {
    let focusElementSpy;

    beforeEach(() => {
      focusElementSpy = sinon.spy(focusUtils, 'focusElement');
    });

    afterEach(() => {
      focusElementSpy.restore();
    });

    it('sets focus to h2 when lettersNewDesign is false', () => {
      render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...defaultProps} lettersNewDesign={false} />
          </MemoryRouter>
        </Provider>,
      );

      // Check that focusElement was called
      expect(focusElementSpy.callCount).to.equal(1);
      // Check what it was called with - when lettersNewDesign is false, it should call with nav header
      const lastCall = focusElementSpy.getCall(0);
      expect(lastCall.args[0]).to.equal('h2#nav-form-header');
    });

    it('sets focus to letters title when lettersNewDesign is true', () => {
      render(
        <Provider store={getStore(true)}>
          <MemoryRouter>
            <LetterList {...defaultProps} lettersNewDesign />
          </MemoryRouter>
        </Provider>,
      );

      // Check that focusElement was called
      expect(focusElementSpy.callCount).to.equal(1);
      // Check what it was called with
      const lastCall = focusElementSpy.getCall(0);
      expect(lastCall.args[0]).to.equal('#letters-title-id');
    });
  });

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
  it('renders VeteranBenefitSummaryLetter lettersPageNewDesign is false', () => {
    const { getByText } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <LetterList {...defaultProps} />
        </MemoryRouter>
      </Provider>,
    );
    expect(getByText('Benefit Summary and Service Verification Letter')).to
      .exist;
    expect(getByText('VA benefit and disability information')).to.exist;
  });
  it('renders VeteranBenefitSummaryOptions lettersPageNewDesign is true', () => {
    const { getByText } = render(
      <Provider store={getStore(true)}>
        <MemoryRouter>
          <LetterList {...defaultProps} />
        </MemoryRouter>
      </Provider>,
    );
    expect(getByText('Benefit Summary and Service Verification Letter')).to
      .exist;
    expect(
      getByText(
        'The Benefit Summary and Service Verification Letter includes your VA benefits and service history. You can customize this letter depending on your needs.',
      ),
    ).to.exist;
  });

  it('render Benefit Summary Letter for letter type benefit_summary_dependent as letter title when lettersPageNewDesign is true', () => {
    const propsWithBenefitSummaryDependentLetter = {
      letters: [
        {
          name: 'Benefit Summary Letter - Dependent',
          letterType: 'benefit_summary_dependent',
        },
      ],
      lettersAvailability: AVAILABILITY_STATUSES.available,
      letterDownloadStatus: {},
      optionsAvailable: true,
    };
    const { getByText } = render(
      <Provider store={getStore(true)}>
        <MemoryRouter>
          <LetterList {...propsWithBenefitSummaryDependentLetter} />
        </MemoryRouter>
      </Provider>,
    );
    expect(getByText('Benefit Summary Letter')).to.exist;
    expect(
      getByText(
        'The Benefit Summary Letter shows the VA benefits you receive as the survivor of a disabled Veteran.',
      ),
    ).to.exist;
  });
  it('renders updated proof of service card description lettersPageNewDesign is true', () => {
    const proofOfService = {
      letters: [
        {
          name: 'Proof of Service Letter',
          letterType: 'proof_of_service',
        },
      ],
      lettersAvailability: AVAILABILITY_STATUSES.available,
      letterDownloadStatus: {},
      optionsAvailable: true,
    };
    const { getByText } = render(
      <Provider store={getStore(true)}>
        <MemoryRouter>
          <LetterList {...proofOfService} />
        </MemoryRouter>
      </Provider>,
    );
    expect(getByText('Proof of Service Card')).to.exist;
    expect(
      getByText(
        'The Proof of Service Card shows that you served honorably in the Armed Forces.',
      ),
    ).to.exist;
  });
  it('renders updated letter description description lettersPageNewDesign is true', () => {
    const props = {
      letters: [
        {
          name: 'Proof of Service Letter',
          letterType: 'proof_of_service',
        },
        {
          name: 'Commissary Letter',
          letterType: 'commissary',
        },
        {
          name: 'Proof of Creditable Prescription Drug Coverage Letter',
          letterType: 'medicare_partd',
        },
        {
          name: 'Proof of Minimum Essential Coverage Letter',
          letterType: 'minimum_essential_coverage',
        },
        {
          name: 'Civil Service Preference Letter',
          letterType: 'civil_service',
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
    const { getByText } = render(
      <Provider store={getStore(true)}>
        <MemoryRouter>
          <LetterList {...props} />
        </MemoryRouter>
      </Provider>,
    );
    expect(getByText('Proof of Service Card')).to.exist;
    expect(
      getByText(
        'The Proof of Service Card shows that you served honorably in the Armed Forces.',
      ),
    ).to.exist;
    expect(
      getByText(
        `The Commissary Letter certifies that you’re eligible to receive commissary store and exchange privileges from the Armed Forces.`,
      ),
    ).to.exist;
    expect(
      getByText(
        'A prescription drug coverage letter proves that you qualify for Medicare Part D prescription drug coverage.',
      ),
    ).to.exist;
    expect(
      getByText(
        'A minimum essential coverage letter proves that you have the right amount of healthcare coverage required by the Affordable Care Act (ACA).',
      ),
    ).to.exist;
    expect(
      getByText(
        'The Civil Service Preference Letter proves that you’re a disabled Veteran and you qualify for preference for civil service jobs.',
      ),
    ).to.exist;
    expect(
      getByText(
        'The Benefit Verification Letter documents your VA financial benefits.',
      ),
    ).to.exist;
  });
});
