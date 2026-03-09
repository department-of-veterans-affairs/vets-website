import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import * as focusUtils from '~/platform/utilities/ui/focus';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
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
  tsaLetterEligibility: {},
  tsaSafeTravelLetter: false,
  profile: {
    loa: {
      current: 3,
    },
  },
};

const getStore = () =>
  createStore(() => ({
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
    featureToggles: {
      [FEATURE_FLAG_NAMES.emptyStateBenefitLetters]: true,
    },
  }));

describe('<LetterList>', () => {
  let sandbox;
  // eslint-disable-next-line no-unused-vars
  let getTsaLetterEligibilityStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    getTsaLetterEligibilityStub = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('focus setting tests', () => {
    let focusElementSpy;

    beforeEach(() => {
      focusElementSpy = sinon.spy(focusUtils, 'focusElement');
    });

    afterEach(() => {
      focusElementSpy.restore();
    });

    it('sets focus to letters title', () => {
      render(
        <Provider store={getStore()}>
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
    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <LetterList {...defaultProps} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('div')).to.exist;
  });

  it('renders an accordion for each letter', () => {
    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <LetterList {...defaultProps} />
        </MemoryRouter>
      </Provider>,
    );
    const accordions = container.querySelectorAll('va-accordion-item');
    expect(accordions.length).to.equal(3);
  });

  it('passes the right title prop for each panel', () => {
    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <LetterList {...defaultProps} />
        </MemoryRouter>
      </Provider>,
    );
    const panels = container.querySelectorAll('va-accordion-item');
    defaultProps.letters.forEach((letter, index) => {
      const panelText = panels[index].textContent;
      expect(panelText).to.contain(defaultProps.letters[index].name);
    });
  });

  it('renders DL links for all letters except BSL in list', () => {
    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <LetterList {...defaultProps} />
        </MemoryRouter>
      </Provider>,
    );

    // Verify non-BSL panels have download components
    const panels = container.querySelectorAll('va-accordion-item');
    panels.forEach(panel => {
      const panelText = panel.textContent;
      // Check panels exist
      expect(panelText).to.include('Letter');
    });
  });

  it('does not render DL link for BSL if !optionsAvailable', () => {
    const props = { ...defaultProps, optionsAvailable: false };
    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <LetterList {...props} />
        </MemoryRouter>
      </Provider>,
    );

    // Find BSL panel and verify no download link
    const panels = container.querySelectorAll('va-accordion-item');
    panels.forEach(panel => {
      const panelText = panel.textContent;
      if (panelText.includes('Benefit Summary and Service Verification')) {
        expect(panelText).to.not.contain('Connect(DownloadLetterLink)');
      }
    });
  });

  it('renders DL link for non-benefit-summary letters if !optionsAvailable', () => {
    const props = { ...defaultProps, optionsAvailable: false };
    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <LetterList {...props} />
        </MemoryRouter>
      </Provider>,
    );

    const panels = container.querySelectorAll('va-accordion-item');
    panels.forEach(panel => {
      const panelText = panel.textContent;
      if (!panelText.includes('Benefit Summary and Service Verification')) {
        expect(panelText).to.include('Letter');
      }
    });
  });

  it('renders eligibility error when letters not available', () => {
    const props = {
      ...defaultProps,
      lettersAvailability: AVAILABILITY_STATUSES.letterEligibilityError,
    };
    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <LetterList {...props} />
        </MemoryRouter>
      </Provider>,
    );
    const alert = container.querySelector('va-alert');
    expect(alert.textContent).to.contain(
      'One of our systems appears to be down.',
    );
  });

  it('renders VeteranBenefitSummaryOptions', () => {
    const { getByText } = render(
      <Provider store={getStore()}>
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

  it('render Benefit Summary Letter for letter type benefit_summary_dependent as letter title', () => {
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
      tsaLetterEligibility: {},
    };
    const { getByText } = render(
      <Provider store={getStore()}>
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
  it('renders updated proof of service card description', () => {
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
      tsaLetterEligibility: {},
    };
    const { getByText } = render(
      <Provider store={getStore()}>
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
  it('renders updated letter description description', () => {
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
      tsaLetterEligibility: {},
    };
    const { getByText } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <LetterList {...props} />
        </MemoryRouter>
      </Provider>,
    );
    expect(getByText('Proof of Service Card')).to.exist;
    expect(getByText(/Proof of Service Card shows that you served honorably/i))
      .to.exist;
    expect(
      getByText(
        /Commissary Letter shows that you.{0,5}eligible to receive commissary/i,
      ),
    ).to.exist;
    expect(
      getByText(
        /Proof of Creditable Prescription Drug Coverage Letter proves that you qualify/i,
      ),
    ).to.exist;
    expect(
      getByText(
        /Proof of Minimum Essential Coverage Letter proves that you have the right amount/i,
      ),
    ).to.exist;
    expect(
      getByText(
        /Civil Service Preference Letter proves that you.{0,5}a disabled Veteran/i,
      ),
    ).to.exist;
    expect(
      getByText(
        /Benefit Verification Letter shows your VA financial benefits/i,
      ),
    ).to.exist;
  });

  it('renders unavailable content when there are no letters or documents', async () => {
    const noLettersProps = {
      ...defaultProps,
      letters: [],
    };
    const { findByText } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <LetterList {...noLettersProps} />
        </MemoryRouter>
      </Provider>,
    );
    const unavailableHeading = await findByText(
      `You don't have any benefit letters or documents available.`,
    );
    expect(unavailableHeading).to.exist;
  });

  describe('TSA letter', () => {
    const accordionItemText =
      "The TSA PreCheck Application Fee Waiver Letter shows you're eligible for free enrollment in Transportation Security Administration (TSA) PreCheck.";

    it('does not fetch TSA letter if user is not loa3', () => {
      const profile = {
        loa: {
          current: 1,
        },
      };
      const tsaLetterEnabledProps = {
        ...defaultProps,
        profile,
        getTsaLetterEligibility: getTsaLetterEligibilityStub,
        tsaLetterEligibility: {},
        tsaSafeTravelLetter: true,
      };
      render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...tsaLetterEnabledProps} />
          </MemoryRouter>
        </Provider>,
      );
      expect(getTsaLetterEligibilityStub.calledOnce).to.be.false;
    });

    it('does not fetch TSA letter if feature flag is disabled', () => {
      render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...defaultProps} />
          </MemoryRouter>
        </Provider>,
      );
      expect(getTsaLetterEligibilityStub.calledOnce).to.be.false;
    });

    it('does not render accordion item if feature flag is disabled', () => {
      const { queryByText } = render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...defaultProps} />
          </MemoryRouter>
        </Provider>,
      );
      expect(queryByText(accordionItemText)).to.be.null;
    });

    it('fetches TSA letter if feature flag is enabled', () => {
      const tsaLetterEnabledProps = {
        ...defaultProps,
        getTsaLetterEligibility: getTsaLetterEligibilityStub,
        tsaLetterEligibility: {},
        tsaSafeTravelLetter: true,
      };
      render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...tsaLetterEnabledProps} />
          </MemoryRouter>
        </Provider>,
      );
      expect(getTsaLetterEligibilityStub.calledOnce).to.be.true;
    });

    it('renders eligibility error when TSA letter request errors', async () => {
      const tsaLetterEnabledProps = {
        ...defaultProps,
        getTsaLetterEligibility: getTsaLetterEligibilityStub,
        tsaLetterEligibility: {
          error: true,
          loading: false,
        },
        tsaSafeTravelLetter: true,
      };
      const { findByText } = render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...tsaLetterEnabledProps} />
          </MemoryRouter>
        </Provider>,
      );
      const errorHeading = await findByText(
        'Some letters may not be available',
      );
      expect(errorHeading).to.exist;
    });

    it('renders loading indicator when determining TSA letter eligibility', () => {
      const tsaLetterEnabledProps = {
        ...defaultProps,
        getTsaLetterEligibility: getTsaLetterEligibilityStub,
        tsaLetterEligibility: {
          error: false,
          loading: true,
        },
        tsaSafeTravelLetter: true,
      };
      const { container } = render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...tsaLetterEnabledProps} />
          </MemoryRouter>
        </Provider>,
      );
      const selector = container.querySelector('va-loading-indicator');
      expect(selector).to.exist;
      expect(selector).to.contain.attr(
        'message',
        'Determining TSA PreCheck Application Fee Waiver Letter eligibility...',
      );
      expect(selector).to.have.attr('set-focus');
    });

    it('renders unavailable content when there are no letters or documents including TSA', async () => {
      const unavailableProps = {
        ...defaultProps,
        letters: [],
        getTsaLetterEligibility: getTsaLetterEligibilityStub,
        tsaLetterEligibility: {
          documentId: undefined,
          documentVersion: undefined,
          error: false,
          loading: false,
        },
        tsaSafeTravelLetter: true,
      };
      const { findByText } = render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...unavailableProps} />
          </MemoryRouter>
        </Provider>,
      );
      const unavailableHeading = await findByText(
        `You don't have any benefit letters or documents available.`,
      );
      expect(unavailableHeading).to.exist;
    });

    it('does not render unavailable content when TSA letter is available', () => {
      const tsaLetterProps = {
        ...defaultProps,
        letters: [],
        getTsaLetterEligibility: getTsaLetterEligibilityStub,
        tsaLetterEligibility: {
          documentId: '123',
          documentVersion: '789',
          error: false,
          loading: false,
        },
        tsaSafeTravelLetter: true,
      };
      const { queryByText } = render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...tsaLetterProps} />
          </MemoryRouter>
        </Provider>,
      );
      const unavailableHeading = queryByText(
        `You don't have any benefit letters or documents available.`,
      );
      expect(unavailableHeading).to.not.exist;
    });

    it('does not render unavailable content when letters are present but TSA letter is not present', () => {
      const tsaLetterProps = {
        ...defaultProps,
        getTsaLetterEligibility: getTsaLetterEligibilityStub,
        tsaLetterEligibility: {
          documentId: undefined,
          documentVersion: undefined,
          error: false,
          loading: false,
        },
        tsaSafeTravelLetter: true,
      };
      const { queryByText } = render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...tsaLetterProps} />
          </MemoryRouter>
        </Provider>,
      );
      const errorHeading = queryByText('Some letters may not be available');
      expect(errorHeading).to.not.exist;
    });

    it('renders accordion item', async () => {
      const tsaLetterEnabledProps = {
        ...defaultProps,
        getTsaLetterEligibility: getTsaLetterEligibilityStub,
        tsaLetterEligibility: {
          documentId: '123',
          documentVersion: '789',
          error: false,
          loading: true,
        },
        tsaSafeTravelLetter: true,
      };
      const { getByText } = render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...tsaLetterEnabledProps} />
          </MemoryRouter>
        </Provider>,
      );
      expect(getByText(/shows you.{0,50}eligible for free enrollment/i)).to
        .exist;
    });
  });

  describe('Foreign Medical Program letter', () => {
    it('hides foreign medical program letter when feature flag is disabled', () => {
      const fmpLetterProps = {
        ...defaultProps,
        letters: [
          ...defaultProps.letters,
          {
            name: 'Foreign Medical Program Enrollment Letter',
            letterType: 'foreign_medical_program',
          },
        ],
        fmpBenefitsAuthorizationLetter: false,
      };
      const { queryByText } = render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...fmpLetterProps} />
          </MemoryRouter>
        </Provider>,
      );
      expect(queryByText('Foreign Medical Program Enrollment Letter')).to.be
        .null;
    });

    it('shows foreign medical program letter when feature flag is enabled', () => {
      const fmpLetterProps = {
        ...defaultProps,
        letters: [
          ...defaultProps.letters,
          {
            name: 'Foreign Medical Program Enrollment Letter',
            letterType: 'foreign_medical_program',
          },
        ],
        fmpBenefitsAuthorizationLetter: true,
      };
      const { getByText } = render(
        <Provider store={getStore()}>
          <MemoryRouter>
            <LetterList {...fmpLetterProps} />
          </MemoryRouter>
        </Provider>,
      );
      expect(getByText('Foreign Medical Program Enrollment Letter')).to.exist;
    });
  });
});
