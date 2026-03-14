import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, cleanup } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ArtifactReviewAccordion from '../../../components/ArtifactSummaryReview';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const completeDD214 = {
  GRADE_RATE_RANK: 'Sergeant',
  PAY_GRADE: 'E-5',
  DATE_INDUCTED: '1970-02-15',
  CAUSE_OF_SEPARATION: 'Completion of required service',
  SEPARATION_TYPE: 'Discharge',
  SEPARATION_CODE: 'BB',
  CHARACTER_OF_SERVICE: 'Honorable',
};

const incompleteDD214 = {
  GRADE_RATE_RANK: null,
  PAY_GRADE: null,
  DATE_INDUCTED: null,
  CAUSE_OF_SEPARATION: null,
  SEPARATION_TYPE: null,
  SEPARATION_CODE: null,
  CHARACTER_OF_SERVICE: null,
};

const completeDeathCert = {
  DECENDENT_DATE_OF_DISPOSITION: '2020-01-05',
  CAUSE_OF_DEATH: 'Heart failure',
  MANNER_OF_DEATH: 'Natural',
  DECENDENT_MARITAL_STATUS: 'Married',
};

// ---------------------------------------------------------------------------
// Store factory
// ---------------------------------------------------------------------------
const makeStore = (files = []) =>
  createStore(() => ({
    form: { data: { files } },
  }));

const makeFileWithDD214 = (entry = completeDD214) => ({
  name: 'dd214.pdf',
  idpTrackingKey: 'track-1',
  idpArtifacts: { dd214: [entry], deathCertificates: [] },
});

const makeFileWithDeathCert = (entry = completeDeathCert) => ({
  name: 'death-cert.pdf',
  idpTrackingKey: 'track-2',
  idpArtifacts: { dd214: [], deathCertificates: [entry] },
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('<ArtifactReviewAccordion />', () => {
  afterEach(cleanup);

  const render_ = (files = [], extraProps = {}) =>
    render(
      <Provider store={makeStore(files)}>
        <ArtifactReviewAccordion {...extraProps} />
      </Provider>,
    );

  it('renders the page heading', () => {
    const screen = render_();
    expect(screen.getByRole('heading', { level: 3 }).textContent).to.include(
      'Review your uploaded documents',
    );
  });

  it('renders the description paragraph', () => {
    const { container } = render_();
    expect(container.textContent).to.include(
      'Review the information we extracted',
    );
  });

  it('does NOT render navigation buttons when goForward is absent', () => {
    const { container } = render_();
    expect(container.querySelector('va-button[text="Continue"]')).to.not.exist;
  });

  it('renders Continue button when goForward is provided', () => {
    const { container } = render_([], { goForward: sinon.spy() });
    expect(container.querySelector('va-button[text="Continue"]')).to.exist;
  });

  it('renders Back button when goBack is provided', () => {
    const { container } = render_([], {
      goForward: sinon.spy(),
      goBack: sinon.spy(),
    });
    expect(container.querySelector('va-button[text="Back"]')).to.exist;
  });

  it('does NOT render Back button when goBack is absent', () => {
    const { container } = render_([], { goForward: sinon.spy() });
    expect(container.querySelector('va-button[text="Back"]')).to.not.exist;
  });

  it('renders no accordion when there are no files', () => {
    const { container } = render_([]);
    expect(container.querySelector('va-accordion')).to.not.exist;
  });

  it('renders a va-accordion when dd214 artifact is present', () => {
    const { container } = render_([makeFileWithDD214()]);
    expect(container.querySelector('va-accordion')).to.exist;
  });

  it('renders one accordion-item for a single dd214 entry', () => {
    const { container } = render_([makeFileWithDD214()]);
    const items = container.querySelectorAll('va-accordion-item');
    expect(items.length).to.equal(1);
  });

  it('accordion-item header is "DD-214" for a single dd214 entry', () => {
    const { container } = render_([makeFileWithDD214()]);
    expect(
      container.querySelector('va-accordion-item').getAttribute('header'),
    ).to.equal('DD-214');
  });

  it('numbers dd214 headers when there are multiple entries', () => {
    const file = {
      name: 'multi.pdf',
      idpTrackingKey: 'track-3',
      idpArtifacts: {
        dd214: [completeDD214, completeDD214],
        deathCertificates: [],
      },
    };
    const { container } = render_([file]);
    const items = container.querySelectorAll('va-accordion-item');
    expect(items.length).to.equal(2);
    expect(items[0].getAttribute('header')).to.equal('DD-214 (1)');
    expect(items[1].getAttribute('header')).to.equal('DD-214 (2)');
  });

  it('renders accordion-item for a death certificate entry', () => {
    const { container } = render_([makeFileWithDeathCert()]);
    const item = container.querySelector('va-accordion-item');
    expect(item).to.exist;
    expect(item.getAttribute('header')).to.equal('Death Certificate');
  });

  it('marks accordion-item with data-has-errors when dd214 has missing required fields', () => {
    const { container } = render_([makeFileWithDD214(incompleteDD214)]);
    const item = container.querySelector('va-accordion-item');
    expect(item.getAttribute('data-has-errors')).to.equal('true');
  });

  it('does NOT mark accordion-item with data-has-errors when dd214 is complete', () => {
    const { container } = render_([makeFileWithDD214(completeDD214)]);
    const item = container.querySelector('va-accordion-item');
    expect(item.getAttribute('data-has-errors')).to.not.equal('true');
  });

  it('calls goForward when Continue is clicked and no errors exist', () => {
    const goForward = sinon.spy();
    const { container } = render_([makeFileWithDD214(completeDD214)], {
      goForward,
    });
    container.querySelector('va-button[text="Continue"]').click();
    expect(goForward.calledOnce).to.be.true;
  });

  it('shows error alert when Continue is clicked with missing required fields', () => {
    const goForward = sinon.spy();
    const { container } = render_([makeFileWithDD214(incompleteDD214)], {
      goForward,
    });
    container.querySelector('va-button[text="Continue"]').click();
    expect(goForward.called).to.be.false;
    expect(container.querySelector('va-alert[status="error"]')).to.exist;
  });

  it('does not show error alert before Continue is clicked', () => {
    const { container } = render_([makeFileWithDD214(incompleteDD214)], {
      goForward: sinon.spy(),
    });
    expect(container.querySelector('va-alert[status="error"]')).to.not.exist;
  });

  // ---------------------------------------------------------------------------
  // Edit flow — DD-214
  // ---------------------------------------------------------------------------

  describe('edit flow for DD-214 section', () => {
    it('clicking Edit enters edit mode showing text inputs', () => {
      const { container } = render_([makeFileWithDD214(completeDD214)], {
        goForward: sinon.spy(),
      });
      container.querySelector('va-button[text="Edit"]').click();
      expect(container.querySelector('va-text-input[name="GRADE_RATE_RANK"]'))
        .to.exist;
      expect(container.querySelector('va-button[text="Save"]')).to.exist;
      expect(container.querySelector('va-button[text="Cancel"]')).to.exist;
    });

    it('clicking Cancel exits edit mode and restores read view', () => {
      const { container } = render_([makeFileWithDD214(completeDD214)], {
        goForward: sinon.spy(),
      });
      container.querySelector('va-button[text="Edit"]').click();
      container.querySelector('va-button[text="Cancel"]').click();
      expect(container.querySelector('va-text-input')).to.not.exist;
      expect(container.querySelector('va-button[text="Edit"]')).to.exist;
    });

    it('clicking Save with a complete draft exits edit mode', () => {
      const { container } = render_([makeFileWithDD214(completeDD214)], {
        goForward: sinon.spy(),
      });
      container.querySelector('va-button[text="Edit"]').click();
      container.querySelector('va-button[text="Save"]').click();
      expect(container.querySelector('va-text-input')).to.not.exist;
    });

    it('clicking Save with an incomplete draft stays in edit mode with errors', () => {
      const { container } = render_([makeFileWithDD214(incompleteDD214)], {
        goForward: sinon.spy(),
      });
      container.querySelector('va-button[text="Edit"]').click();
      container.querySelector('va-button[text="Save"]').click();
      const gradeInput = container.querySelector(
        'va-text-input[name="GRADE_RATE_RANK"]',
      );
      expect(gradeInput).to.exist; // still in edit mode
      expect(gradeInput.getAttribute('error')).to.not.be.null;
    });

    it('shows "Missing" for incomplete required fields in read mode', () => {
      const { container } = render_([makeFileWithDD214(incompleteDD214)]);
      expect(container.textContent).to.include('Missing');
    });

    it('shows error subheader text on an incomplete accordion item', () => {
      const { container } = render_([makeFileWithDD214(incompleteDD214)]);
      const item = container.querySelector('va-accordion-item');
      expect(item.getAttribute('subheader')).to.include('missing');
    });
  });

  // ---------------------------------------------------------------------------
  // Edit flow — Death Certificate
  // ---------------------------------------------------------------------------

  describe('edit flow for Death Certificate section', () => {
    it('clicking Edit on death cert section shows memorable date input', () => {
      const { container } = render_(
        [makeFileWithDeathCert(completeDeathCert)],
        { goForward: sinon.spy() },
      );
      container.querySelector('va-button[text="Edit"]').click();
      expect(container.querySelector('va-memorable-date')).to.exist;
    });

    it('marks accordion-item with data-has-errors for incomplete death cert', () => {
      const incompleteDeath = {
        DECENDENT_DATE_OF_DISPOSITION: null,
        CAUSE_OF_DEATH: null,
        MANNER_OF_DEATH: null,
        DECENDENT_MARITAL_STATUS: null,
      };
      const { container } = render_([makeFileWithDeathCert(incompleteDeath)]);
      expect(
        container
          .querySelector('va-accordion-item')
          .getAttribute('data-has-errors'),
      ).to.equal('true');
    });

    it('numbers death certificate headers when there are multiple entries', () => {
      const file = {
        name: 'multi-death.pdf',
        idpTrackingKey: 'track-4',
        idpArtifacts: {
          dd214: [],
          deathCertificates: [completeDeathCert, completeDeathCert],
        },
      };
      const { container } = render_([file]);
      const items = container.querySelectorAll('va-accordion-item');
      expect(items.length).to.equal(2);
      expect(items[0].getAttribute('header')).to.equal('Death Certificate (1)');
      expect(items[1].getAttribute('header')).to.equal('Death Certificate (2)');
    });

    it('hides optional rows (B/C/D) when values are absent', () => {
      const deathCertNoOptional = {
        ...completeDeathCert,
        UNDERLYING_CAUSE_OF_DEATH_B: null,
        UNDERLYING_CAUSE_OF_DEATH_C: null,
        UNDERLYING_CAUSE_OF_DEATH_D: null,
      };
      const { container } = render_([
        makeFileWithDeathCert(deathCertNoOptional),
      ]);
      expect(container.textContent).to.not.include('Cause of death B');
      expect(container.textContent).to.not.include('Cause of death C');
    });
  });

  // ---------------------------------------------------------------------------
  // Edge cases
  // ---------------------------------------------------------------------------

  describe('edge cases', () => {
    it('does not render accordion for files without idpArtifacts', () => {
      const fileWithoutArtifacts = {
        name: 'doc.pdf',
        idpTrackingKey: 'track-x',
      };
      const { container } = render_([fileWithoutArtifacts]);
      expect(container.querySelector('va-accordion')).to.not.exist;
    });

    it('renders both dd214 and death cert accordion items from a single file', () => {
      const mixedFile = {
        name: 'mixed.pdf',
        idpTrackingKey: 'track-5',
        idpArtifacts: {
          dd214: [completeDD214],
          deathCertificates: [completeDeathCert],
        },
      };
      const { container } = render_([mixedFile]);
      const items = container.querySelectorAll('va-accordion-item');
      expect(items.length).to.equal(2);
    });
  });
});
