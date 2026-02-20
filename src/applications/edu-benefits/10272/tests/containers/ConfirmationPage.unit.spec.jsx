import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';

import formConfig from '../../config/form';
import ConfirmationPage, {
  getClaimIdFromLocalStage,
  setClaimIdInLocalStage,
} from '../../containers/ConfirmationPage';

const mockStore = state => createStore(() => state);

const routerSpy = {
  push: sinon.spy(),
};

before(() => {
  if (!global.scrollTo) global.scrollTo = () => {};
});

const getPage = data =>
  render(
    <Provider
      store={mockStore({
        form: {
          ...createInitialState(formConfig),
          submission: {},
          data,
        },
      })}
    >
      <ConfirmationPage route={{ formConfig }} router={routerSpy} />
    </Provider>,
  );

describe('<ConfirmationPage />', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    routerSpy.push.reset();
    cleanup();
  });

  it('shows info alert', () => {
    const { container } = getPage({});
    const infoAlert = container.querySelector('va-alert');

    expect(infoAlert).to.have.attribute('status', 'info');
    expect(infoAlert.innerHTML).to.include('Complete all submission steps');
  });

  it('shows process list section', () => {
    const { container } = getPage({});

    expect(container.querySelector('va-process-list')).to.exist;
    expect(container.querySelectorAll('va-process-list-item').length).to.equal(
      3,
    );
  });

  describe('Additional form needed (alert)', () => {
    it('shows alert when the user has not previously applied for benefits', () => {
      const { getByTestId } = getPage({
        hasPreviouslyApplied: false,
      });
      const warningAlert = getByTestId('eligibility-alert');

      expect(warningAlert).to.have.attribute('status', 'warning');
      expect(warningAlert.innerHTML).to.include('Additional form needed');
      expect(warningAlert).to.have.attribute('visible', 'true');
    });

    it('hides alert when the user has previously applied for benefits', () => {
      const { getByTestId } = getPage({
        hasPreviouslyApplied: true,
      });
      const warningAlert = getByTestId('eligibility-alert');

      expect(warningAlert).to.have.attribute('visible', 'false');
    });
  });

  it('shows button to print page', () => {
    const { container } = getPage({});

    expect(container.querySelector('va-button')).to.have.attribute(
      'text',
      'Print this page',
    );
  });

  it('shows link to go back to the previous page', () => {
    const { container } = getPage({});

    expect(container.querySelector('va-link[text="Back"]')).to.exist;
  });

  it('shows mailing addresses accordion', () => {
    const { container } = getPage({});

    expect(container.querySelector('va-accordion')).to.exist;
    expect(container.querySelectorAll('va-accordion-item').length).to.equal(2);
  });

  it('shows section for "what are my next steps?"', () => {
    const { getByTestId } = getPage({});
    const nextStepsHeader = getByTestId('next-steps-header');

    expect(nextStepsHeader.innerHTML).to.include('What are my next steps?');
    expect(getByTestId('next-steps-content')).to.exist;
  });

  it('renders safely when submission object is empty (defaults kick in)', () => {
    const { container, queryByText } = getPage({});

    expect(container.querySelector('va-alert')).to.have.attribute(
      'status',
      'info',
    );

    expect(queryByText('Download your completed VA Form 22-10272')).to.be.null;
  });

  describe('Functional Actions', () => {
    it('should set claim id in local storage', () => {
      const submission = {
        response: {
          id: 1,
        },
      };
      setClaimIdInLocalStage(submission);

      const result = getClaimIdFromLocalStage();
      expect(result).to.equal(submission.response.id);
    });

    it('should call window.print when print button is clicked', () => {
      const { getByTestId } = getPage({});
      const printSpy = sinon.spy(window, 'print');

      fireEvent.click(getByTestId('print-page'));

      expect(printSpy.calledOnce).to.be.true;
      printSpy.restore();
    });

    it("should call router.push('/review-and-submit') when back button is clicked", () => {
      const { getByTestId } = getPage({});

      fireEvent.click(getByTestId('back-button'));

      expect(routerSpy.push.calledOnce).to.be.true;
      expect(routerSpy.push.calledWith('/review-and-submit')).to.be.true;
    });
  });
});
