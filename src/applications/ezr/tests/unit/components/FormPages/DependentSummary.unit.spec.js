import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentSummary from '../../../../components/FormPages/DependentSummary';
import { DEPENDENT_VIEW_FIELDS } from '../../../../utils/constants';
import content from '../../../../locales/en/content.json';

describe('ezr DependentSummary page', () => {
  const dependentData = {
    empty: [],
    populated: [
      {
        fullName: { first: 'John', last: 'Smith' },
        dependentRelation: 'son',
      },
    ],
  };
  const getData = ({
    onReviewPage = false,
    dependents = undefined,
    addDependent = undefined,
  }) => ({
    props: {
      data: {
        dependents,
        [DEPENDENT_VIEW_FIELDS.add]: addDependent,
      },
      onReviewPage,
      goForward: sinon.spy(),
      goToPath: sinon.spy(),
      setFormData: sinon.spy(),
    },
  });

  context('when no dependents have been reported', () => {
    it('should render a general page title', () => {
      const { props } = getData({});
      const { container } = render(<DependentSummary {...props} />);
      expect(container.querySelector('#root__title')).to.contain.text(
        content['household-dependent-summary-title'],
      );
    });

    it('should not render the dependents list field', () => {
      const { props } = getData({ dependents: dependentData.empty });
      const { container } = render(<DependentSummary {...props} />);
      expect(
        container.querySelector('[data-testid="ezr-dependent-list-field"]'),
      ).to.not.exist;
    });
  });

  context('when dependents have been reported', () => {
    const { props } = getData({ dependents: dependentData.populated });

    it('should render the specific form page title', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(container.querySelector('#root__title')).to.contain.text(
        content['household-dependent-summary-list-title'],
      );
    });

    it('should render the dependents list field', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(
        container.querySelector('[data-testid="ezr-dependent-list-field"]'),
      ).to.exist;
    });
  });

  context('when not rendered on the review page', () => {
    const { props } = getData({});

    it('should render the dependent declaration field', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(
        container.querySelector(
          '[data-testid="ezr-dependent-declaration-field"]',
        ),
      ).to.exist;
    });

    it('should render the form progress buttons', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(container.querySelector('.form-progress-buttons')).to.exist;
    });

    it('should not render the `update page` button', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(container.querySelector('[data-testid="ezr-update-button"]')).to
        .not.exist;
    });
  });

  context('when rendered on the review page', () => {
    const { props } = getData({
      dependents: dependentData.populated,
      onReviewPage: true,
    });

    it('should not render the dependent declaration field', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(
        container.querySelector(
          '[data-testid="ezr-dependent-declaration-field"]',
        ),
      ).to.not.exist;
    });

    it('should not render the form progress buttons', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(container.querySelector('.form-progress-buttons')).to.not.exist;
    });

    it('should render the `update page` button', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(container.querySelector('[data-testid="ezr-update-button"]')).to
        .exist;
    });
  });

  context('when the `Continue` button is clicked', () => {
    it('should not fire the `goForward` or `goToPath` spy without form data', () => {
      const { props } = getData({});
      const { container } = render(<DependentSummary {...props} />);
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(props.goForward.called).to.not.be.true;
      expect(props.goToPath.called).to.not.be.true;
    });

    it('should not fire the `goForward` or `goToPath` spy when there is already a validation error', () => {
      const { props } = getData({});
      const { container } = render(<DependentSummary {...props} />);
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(props.goForward.called).to.be.false;
      expect(props.goToPath.called).to.be.false;
      fireEvent.click(selector);
      expect(props.goForward.called).to.be.false;
      expect(props.goToPath.called).to.be.false;
    });

    it('should fire the `goForward` spy when the field value is set to `false`', () => {
      const { props } = getData({ addDependent: false });
      const { container } = render(<DependentSummary {...props} />);
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(props.goToPath.called).to.be.false;
      expect(props.goForward.called).to.be.true;
    });

    it('should fire the `goToPath` spy when the field value is set to `true`', () => {
      const { props } = getData({ addDependent: true });
      const { container } = render(<DependentSummary {...props} />);
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(props.goForward.called).to.be.false;
      expect(props.goToPath.called).to.be.true;
    });
  });

  context('when the form data changes', () => {
    it('should fire the `setFormData` spy', () => {
      const { props } = getData({});
      const { container } = render(<DependentSummary {...props} />);
      const selector = container.querySelector(
        '#root_view\\3A reportDependentsNo',
      );
      fireEvent.click(selector);
      expect(props.setFormData.called).to.be.true;
    });
  });

  context('when the user attempts to remove a dependent record', () => {
    it('should fire the `setFormData` spy when confirming the action', async () => {
      const { props } = getData({ dependents: dependentData.populated });
      const { container } = render(<DependentSummary {...props} />);
      const selectors = {
        removeBtn: container.querySelector('.ezr-button-remove'),
        modal: container.querySelector('va-modal'),
      };

      fireEvent.click(selectors.removeBtn);
      selectors.modal.__events.primaryButtonClick();

      await waitFor(() => {
        expect(props.setFormData.called).to.be.true;
      });
    });

    it('should not fire the `setFormData` spy when canceling the action', async () => {
      const { props } = getData({ dependents: dependentData.populated });
      const { container } = render(<DependentSummary {...props} />);
      const selectors = {
        removeBtn: container.querySelector('.ezr-button-remove'),
        modal: container.querySelector('va-modal'),
      };

      fireEvent.click(selectors.removeBtn);
      selectors.modal.__events.secondaryButtonClick();

      await waitFor(() => {
        expect(props.setFormData.called).to.be.false;
      });
    });
  });
});
