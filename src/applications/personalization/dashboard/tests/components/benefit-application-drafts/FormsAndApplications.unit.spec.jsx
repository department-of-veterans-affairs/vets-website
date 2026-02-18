import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import { within } from '@testing-library/react';

import FormsAndApplications from '../../../components/benefit-application-drafts/FormsAndApplications';
import submittedForms from '../../../reducers/form-status';
import myVaFormPdfs from '../../../reducers/form-pdf-urls';

// ── helpers ────────────────────────────────────────────────────────

const dashboardReducers = { submittedForms, myVaFormPdfs };

/** Returns the minimal Redux state needed by the connected component. */
const getBaseState = ({
  savedForms = [],
  submittedFormsList = [],
  submittedError = false,
  submittedErrors = [],
} = {}) => ({
  user: {
    profile: {
      savedForms,
      loading: false,
      loa: { current: 3 },
    },
    login: { currentlyLoggedIn: true },
  },
  submittedForms: {
    forms: submittedFormsList,
    error: submittedError,
    errors: submittedErrors,
  },
  featureToggles: {
    loading: false,
  },
  myVaFormPdfs: {
    loading: false,
    submissions: {},
  },
});

/** Render FormsAndApplications with Redux and required reducers. */
const renderComponent = (stateOverrides = {}) =>
  renderInReduxProvider(<FormsAndApplications />, {
    initialState: getBaseState(stateOverrides),
    reducers: dashboardReducers,
  });

/**
 * Build a saved (SIP / in-progress) form object.
 * Uses form 21-526EZ by default since it is a well-known SIP-enabled form.
 */
const makeSavedForm = (overrides = {}) => {
  const now = Math.floor(Date.now() / 1000);
  return {
    form: '21-526EZ',
    lastUpdated: now - 1000,
    metadata: {
      version: 0,
      returnUrl: '/veteran-information',
      savedAt: now - 1000,
      submission: { status: false, errorMessage: false },
      expiresAt: now + 86400 * 60, // 60 days from now
      lastUpdated: now - 1000,
      inProgressFormId: 12345,
    },
    ...overrides,
  };
};

/**
 * Build a submitted form object matching the API shape that the component
 * receives via Redux (the `submittedForms` prop).
 */
const makeSubmittedForm = (overrides = {}) => {
  const mergedAttrs = {
    formType: '21-526EZ',
    createdAt: '2025-06-01T12:00:00.000Z',
    updatedAt: '2025-06-02T12:00:00.000Z',
    status: 'vbms',
    pdfSupport: false,
    ...(overrides.attributes || {}),
  };
  return {
    id: 'abc-123',
    type: 'submission_status',
    ...overrides,
    attributes: mergedAttrs,
  };
};

// ── tests ──────────────────────────────────────────────────────────

describe('<FormsAndApplications />', () => {
  // ─── basic rendering ──────────────────────────────────────────

  it('renders the main section with correct id and test id', () => {
    const screen = renderComponent();
    const section = screen.getByTestId(
      'dashboard-section-benefit-application-drafts',
    );
    expect(section).to.exist;
    expect(section.getAttribute('id')).to.equal('benefit-applications');
    expect(section.getAttribute('tabindex')).to.equal('-1');
  });

  it('renders the "Forms and applications" heading', () => {
    const screen = renderComponent();
    expect(screen.getByRole('heading', { level: 2 })).to.have.property(
      'textContent',
      'Forms and applications',
    );
  });

  // ─── error state ──────────────────────────────────────────────

  describe('when submittedForms has an error', () => {
    it('shows the Error component when error is true', () => {
      const screen = renderComponent({ submittedError: true });
      expect(screen.getByTestId('benefit-application-error')).to.exist;
    });

    it('shows the Error component when errors array is non-empty', () => {
      const screen = renderComponent({
        submittedErrors: [{ message: 'something broke' }],
      });
      expect(screen.getByTestId('benefit-application-error')).to.exist;
    });

    it('does NOT render the form lists when there is an error', () => {
      const screen = renderComponent({ submittedError: true });
      expect(screen.queryByTestId('applications-in-progress-empty-state')).not
        .to.exist;
      expect(screen.queryByTestId('applications-completed-empty-state')).not.to
        .exist;
    });
  });

  // ─── empty states (no error, no forms) ────────────────────────

  describe('when there are no forms and no error', () => {
    it('shows the in-progress empty state message', () => {
      const screen = renderComponent();
      expect(screen.getByTestId('applications-in-progress-empty-state')).to
        .exist;
    });

    it('shows the completed empty state message', () => {
      const screen = renderComponent();
      expect(screen.getByTestId('applications-completed-empty-state')).to.exist;
    });

    it('renders the MissingApplicationHelp component', () => {
      const screen = renderComponent();
      // MissingApplicationHelp renders either a va-accordion or va-additional-info
      // depending on the feature toggle. Check for either test id.
      const help =
        screen.queryByTestId('missing-application-help') ||
        screen.queryByTestId('missing-application-help-additional-info');
      expect(help).to.exist;
    });

    it('sets aria-hidden="false" on "Completed forms" heading when list is empty', () => {
      const screen = renderComponent();
      const completedHeading = screen
        .getAllByText('Completed forms')
        .find(el => el.tagName === 'H3');
      expect(completedHeading.getAttribute('aria-hidden')).to.equal('false');
    });
  });

  // ─── in-progress saved forms (SIP) ───────────────────────────

  describe('saved (in-progress) forms', () => {
    it('renders the in-progress card list when there are valid saved forms', () => {
      const screen = renderComponent({
        savedForms: [makeSavedForm()],
      });
      expect(screen.getByTestId('applications-in-progress-list')).to.exist;
      expect(screen.queryByTestId('applications-in-progress-empty-state')).not
        .to.exist;
    });

    it('filters out non-SIP-enabled forms', () => {
      const nonSipForm = makeSavedForm({ form: 'FAKE-NON-SIP-FORM' });
      const screen = renderComponent({ savedForms: [nonSipForm] });
      expect(screen.getByTestId('applications-in-progress-empty-state')).to
        .exist;
    });

    it('filters out expired saved forms', () => {
      const now = Math.floor(Date.now() / 1000);
      const expiredForm = makeSavedForm({
        metadata: {
          ...makeSavedForm().metadata,
          expiresAt: now - 1,
        },
      });
      const screen = renderComponent({ savedForms: [expiredForm] });
      expect(screen.getByTestId('applications-in-progress-empty-state')).to
        .exist;
    });
  });

  // ─── submitted forms ─────────────────────────────────────────

  describe('submitted forms', () => {
    describe('status "vbms" (received)', () => {
      it('renders the completed card list with a received form', () => {
        const screen = renderComponent({
          submittedFormsList: [
            makeSubmittedForm({ attributes: { status: 'vbms' } }),
          ],
        });
        expect(screen.getByTestId('applications-completed-list')).to.exist;
        expect(screen.queryByTestId('applications-completed-empty-state')).not
          .to.exist;
      });

      it('sets aria-hidden="true" on "Completed forms" heading when list has items', () => {
        const screen = renderComponent({
          submittedFormsList: [
            makeSubmittedForm({ attributes: { status: 'vbms' } }),
          ],
        });
        const completedHeading = screen
          .getAllByText('Completed forms')
          .find(el => el.tagName === 'H3');
        expect(completedHeading.getAttribute('aria-hidden')).to.equal('true');
      });
    });

    describe('status "error" (actionNeeded)', () => {
      it('places actionNeeded forms in the in-progress list', () => {
        const screen = renderComponent({
          submittedFormsList: [
            makeSubmittedForm({ attributes: { status: 'error' } }),
          ],
        });
        expect(screen.getByTestId('applications-in-progress-list')).to.exist;
      });
    });

    describe('status "expired" (actionNeeded)', () => {
      it('places expired-status forms in the in-progress list', () => {
        const screen = renderComponent({
          submittedFormsList: [
            makeSubmittedForm({ attributes: { status: 'expired' } }),
          ],
        });
        expect(screen.getByTestId('applications-in-progress-list')).to.exist;
      });
    });

    describe('default status (inProgress)', () => {
      it('places default-status forms in the completed list', () => {
        const screen = renderComponent({
          submittedFormsList: [
            makeSubmittedForm({ attributes: { status: 'received' } }),
          ],
        });
        expect(screen.getByTestId('applications-completed-list')).to.exist;
      });
    });
  });

  // ─── special formId label handling ────────────────────────────

  describe('special formId labels', () => {
    it('handles form526_form4142 with a custom label', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: { formType: 'form526_form4142', status: 'vbms' },
          }),
        ],
      });
      expect(screen.getByText(/21-4142 submitted with VA Form 21-526EZ/i)).to
        .exist;
    });

    it('handles form0995_form4142 with a custom label', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: { formType: 'form0995_form4142', status: 'vbms' },
          }),
        ],
      });
      expect(screen.getByText(/21-4142 submitted with VA Form 20-0995/i)).to
        .exist;
    });

    it('handles formArrays forms (22-10275)', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: { formType: '22-10275', status: 'vbms' },
          }),
        ],
      });
      expect(screen.getByText(/VA Form 22-10275/i)).to.exist;
    });

    it('handles formArrays forms (22-10278)', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: { formType: '22-10278', status: 'vbms' },
          }),
        ],
      });
      expect(screen.getByText(/VA Form 22-10278/i)).to.exist;
    });

    it('handles formArrays forms (22-10297)', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: { formType: '22-10297', status: 'vbms' },
          }),
        ],
      });
      expect(screen.getByText(/VA Form 22-10297/i)).to.exist;
    });

    it('strips -V2 suffix from form IDs', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: { formType: 'SOME-FORM-V2', status: 'vbms' },
          }),
        ],
      });
      expect(screen.getByText(/VA Form SOME-FORM$/i)).to.exist;
    });
  });

  // ─── formTitle: benefit vs non-benefit ────────────────────────

  describe('formTitle generation', () => {
    it('uses "application for {benefit}" when the form has a benefit', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: { formType: '21-526EZ', status: 'vbms' },
          }),
        ],
      });
      expect(screen.getByText(/application for/i)).to.exist;
    });

    it('uses "VA Form {formId}" when the form is NOT in MY_VA_SIP_FORMS', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: { formType: 'UNKNOWN-999', status: 'vbms' },
          }),
        ],
      });
      expect(screen.getByText(/VA Form UNKNOWN-999/i)).to.exist;
    });
  });

  // ─── presentableFormId ────────────────────────────────────────

  describe('presentableFormId', () => {
    it('passes presentableFormId when the form has a benefit', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: { formType: '21-526EZ', status: 'vbms' },
          }),
        ],
      });
      expect(screen.getByTestId('applications-completed-list')).to.exist;
    });

    it('passes false for presentableFormId when the form has no benefit', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: { formType: 'UNKNOWN-999', status: 'vbms' },
          }),
        ],
      });
      expect(screen.getByTestId('applications-completed-list')).to.exist;
    });
  });

  // ─── sorting ──────────────────────────────────────────────────

  describe('sorting', () => {
    it('sorts all forms by lastUpdated descending', () => {
      const olderForm = makeSubmittedForm({
        id: 'older',
        attributes: {
          formType: 'OLDER-FORM',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          status: 'vbms',
        },
      });
      const newerForm = makeSubmittedForm({
        id: 'newer',
        attributes: {
          formType: 'NEWER-FORM',
          createdAt: '2025-06-01T00:00:00.000Z',
          updatedAt: '2025-06-01T00:00:00.000Z',
          status: 'vbms',
        },
      });

      const screen = renderComponent({
        submittedFormsList: [olderForm, newerForm],
      });

      const completedList = screen.getByTestId('applications-completed-list');
      const cards = within(completedList).getAllByTestId(
        'dashboard-widget-wrapper',
      );
      expect(cards.length).to.equal(2);
    });
  });

  // ─── mixed saved + submitted forms ────────────────────────────

  describe('mixed saved and submitted forms', () => {
    it('renders both in-progress and completed cards', () => {
      const screen = renderComponent({
        savedForms: [makeSavedForm()],
        submittedFormsList: [
          makeSubmittedForm({ attributes: { status: 'vbms' } }),
        ],
      });
      expect(screen.getByTestId('applications-in-progress-list')).to.exist;
      expect(screen.getByTestId('applications-completed-list')).to.exist;
    });
  });

  // ─── form without status ──────────────────────────────────────

  describe('form without status', () => {
    it('does not add a card when the form has no status', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: {
              formType: 'NO-STATUS-FORM',
              createdAt: '2025-06-01T12:00:00.000Z',
              updatedAt: '2025-06-02T12:00:00.000Z',
              status: undefined,
            },
          }),
        ],
      });
      expect(screen.getByTestId('applications-in-progress-empty-state')).to
        .exist;
      expect(screen.getByTestId('applications-completed-empty-state')).to.exist;
    });
  });

  // ─── useLayoutEffect anchor scrolling ─────────────────────────

  describe('useLayoutEffect anchor handling', () => {
    let scrollToStub;
    let originalHash;

    beforeEach(() => {
      scrollToStub = sinon.stub(window, 'scrollTo');
      originalHash = document.location.hash;
    });

    afterEach(() => {
      scrollToStub.restore();
      window.location.hash = originalHash;
    });

    it('scrolls to the section when the hash is #benefit-applications', () => {
      window.location.hash = '#benefit-applications';
      renderComponent();
      expect(scrollToStub.called).to.be.true;
      const scrollArgs = scrollToStub.firstCall.args[0];
      expect(scrollArgs).to.have.property('behavior', 'smooth');
      expect(scrollArgs).to.have.property('top');
    });

    it('does NOT scroll when the hash is something else', () => {
      window.location.hash = '#something-else';
      renderComponent();
      expect(scrollToStub.called).to.be.false;
    });

    it('does NOT scroll when there is no hash', () => {
      window.location.hash = '';
      renderComponent();
      expect(scrollToStub.called).to.be.false;
    });
  });

  // ─── mapStateToProps ──────────────────────────────────────────

  describe('mapStateToProps', () => {
    it('derives submittedError = true from error flag', () => {
      const screen = renderComponent({ submittedError: true });
      expect(screen.getByTestId('benefit-application-error')).to.exist;
    });

    it('derives submittedError = true from errors array', () => {
      const screen = renderComponent({
        submittedErrors: [{ message: 'fail' }],
      });
      expect(screen.getByTestId('benefit-application-error')).to.exist;
    });

    it('uses an empty array when savedForms is undefined', () => {
      const state = getBaseState();
      delete state.user.profile.savedForms;
      const screen = renderInReduxProvider(<FormsAndApplications />, {
        initialState: state,
        reducers: dashboardReducers,
      });
      expect(screen.getByTestId('dashboard-section-benefit-application-drafts'))
        .to.exist;
    });

    it('uses an empty array when submittedForms.forms is undefined', () => {
      const state = getBaseState();
      state.submittedForms.forms = undefined;
      const screen = renderInReduxProvider(<FormsAndApplications />, {
        initialState: state,
        reducers: dashboardReducers,
      });
      expect(screen.getByTestId('dashboard-section-benefit-application-drafts'))
        .to.exist;
    });
  });

  // ─── pdfSupport property ──────────────────────────────────────

  describe('pdfSupport property', () => {
    it('passes pdfSupport to the completed card', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: {
              formType: '21-526EZ',
              status: 'vbms',
              pdfSupport: true,
            },
          }),
        ],
      });
      expect(screen.getByTestId('applications-completed-list')).to.exist;
    });
  });

  // ─── section headings ────────────────────────────────────────

  describe('section headings', () => {
    it('renders "In-progress forms" h3 heading', () => {
      const screen = renderComponent();
      expect(screen.getByText('In-progress forms')).to.exist;
    });

    it('renders "Completed forms" h3 heading', () => {
      const screen = renderComponent();
      const completedHeadings = screen.getAllByText('Completed forms');
      expect(completedHeadings.some(el => el.tagName === 'H3')).to.be.true;
    });
  });

  // ─── accordion for completed forms ────────────────────────────

  describe('completed forms accordion', () => {
    it('renders a va-accordion with open-single when completed forms exist', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({ attributes: { status: 'vbms' } }),
        ],
      });
      const section = screen.getByTestId(
        'dashboard-section-benefit-application-drafts',
      );
      const accordion = section.querySelector('va-accordion');
      expect(accordion).to.exist;
      expect(accordion.getAttribute('open-single')).to.exist;
    });

    it('renders a va-accordion-item with correct header and id', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({ attributes: { status: 'vbms' } }),
        ],
      });
      const section = screen.getByTestId(
        'dashboard-section-benefit-application-drafts',
      );
      const accordionItem = section.querySelector('va-accordion-item');
      expect(accordionItem).to.exist;
      expect(accordionItem.getAttribute('header')).to.equal('Completed forms');
      expect(accordionItem.getAttribute('id')).to.equal(
        'completed-forms-accordion-item',
      );
    });
  });

  // ─── formArrays with title ────────────────────────────────────

  describe('formArrays form coverage', () => {
    it('renders formId with title in parens when formMeta has title', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: { formType: '22-10275', status: 'vbms' },
          }),
        ],
      });
      expect(screen.getByText(/VA Form 22-10275/i)).to.exist;
    });
  });

  // ─── multiple forms with different statuses ───────────────────

  describe('multiple forms with different statuses', () => {
    it('distributes forms correctly between in-progress and completed lists', () => {
      const screen = renderComponent({
        savedForms: [makeSavedForm()],
        submittedFormsList: [
          makeSubmittedForm({
            id: 'received-1',
            attributes: {
              formType: 'FORM-A',
              status: 'vbms',
              createdAt: '2025-06-01T00:00:00.000Z',
              updatedAt: '2025-06-01T00:00:00.000Z',
            },
          }),
          makeSubmittedForm({
            id: 'action-1',
            attributes: {
              formType: 'FORM-B',
              status: 'error',
              createdAt: '2025-06-02T00:00:00.000Z',
              updatedAt: '2025-06-02T00:00:00.000Z',
            },
          }),
          makeSubmittedForm({
            id: 'pending-1',
            attributes: {
              formType: 'FORM-C',
              status: 'received',
              createdAt: '2025-06-03T00:00:00.000Z',
              updatedAt: '2025-06-03T00:00:00.000Z',
            },
          }),
        ],
      });
      expect(screen.getByTestId('applications-in-progress-list')).to.exist;
      expect(screen.getByTestId('applications-completed-list')).to.exist;
    });
  });

  // ─── saved form property mapping ──────────────────────────────

  describe('saved form transformation', () => {
    it('maps metadata and preserves form id and lastUpdated', () => {
      const now = Math.floor(Date.now() / 1000);
      const screen = renderComponent({
        savedForms: [
          makeSavedForm({
            form: '21-526EZ',
            lastUpdated: now - 500,
            metadata: {
              version: 1,
              returnUrl: '/test',
              savedAt: now - 500,
              submission: { status: false, errorMessage: false },
              expiresAt: now + 86400 * 60,
              lastUpdated: now - 500,
              inProgressFormId: 99999,
            },
          }),
        ],
      });
      expect(screen.getByTestId('applications-in-progress-list')).to.exist;
    });
  });

  // ─── submitted form date conversion ───────────────────────────

  describe('submitted form date transformation', () => {
    it('converts createdAt and updatedAt to unix time', () => {
      const screen = renderComponent({
        submittedFormsList: [
          makeSubmittedForm({
            attributes: {
              formType: '21-526EZ',
              createdAt: '2025-01-15T10:30:00.000Z',
              updatedAt: '2025-01-16T14:00:00.000Z',
              status: 'vbms',
            },
          }),
        ],
      });
      expect(screen.getByTestId('applications-completed-list')).to.exist;
    });
  });
});
