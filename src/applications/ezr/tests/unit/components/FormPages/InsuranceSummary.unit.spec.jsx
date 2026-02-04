import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import InsuranceSummary from '../../../../components/FormPages/InsuranceSummary';
import { INSURANCE_VIEW_FIELDS } from '../../../../utils/constants';

describe('ezr InsuranceSummary', () => {
  const policyData = {
    empty: [],
    populated: [
      {
        insuranceName: 'Cigna',
        insurancePolicyHolderName: 'John Smith',
        'view:policyOrGroup': {
          insurancePolicyNumber: '006655',
        },
      },
    ],
    insuranceNumbersMissing: [
      {
        insuranceName: 'Cigna',
        insurancePolicyHolderName: 'John Smith',
        'view:policyOrGroup': {},
      },
    ],
    insuranceNameTooLong: [
      {
        insuranceName:
          '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
        insurancePolicyHolderName: 'John Smith',
        'view:policyOrGroup': {
          insurancePolicyNumber: '006655',
        },
      },
    ],
    insurancePolicyHolderNameTooLong: [
      {
        insuranceName: 'Cigna',
        insurancePolicyHolderName:
          '123456789012345678901234567890123456789012345678901',
        'view:policyOrGroup': {
          insurancePolicyNumber: '006655',
        },
      },
    ],
    insurancePolicyNumberTooLong: [
      {
        insuranceName: 'Cigna',
        insurancePolicyHolderName: 'John Smith',
        'view:policyOrGroup': {
          insurancePolicyNumber: '1234567890123456789012345678901',
        },
      },
    ],
    insuranceGroupCodeTooLong: [
      {
        insuranceName: 'Cigna',
        insurancePolicyHolderName: 'John Smith',
        'view:policyOrGroup': {
          insuranceGroupCode: '1234567890123456789012345678901',
        },
      },
    ],
  };
  const getData = ({
    onReviewPage = false,
    providers = undefined,
    addPolicy = undefined,
  }) => ({
    props: {
      data: {
        providers,
        [INSURANCE_VIEW_FIELDS.add]: addPolicy,
      },
      onReviewPage,
      goForward: sinon.spy(),
      goToPath: sinon.spy(),
      setFormData: sinon.spy(),
    },
  });

  context('when no policies have been added', () => {
    it('should not render the policy list field', () => {
      const { props } = getData({ providers: policyData.empty });
      const { container } = render(<InsuranceSummary {...props} />);
      expect(container.querySelector('[data-testid="ezr-policy-list-field"]'))
        .to.not.exist;
    });
  });

  context('when policies have been added', () => {
    const { props } = getData({ providers: policyData.populated });

    it('should render the policy list field', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(container.querySelector('[data-testid="ezr-policy-list-field"]'))
        .to.exist;
    });
  });

  context('when not rendered on the review page', () => {
    const { props } = getData({});

    it('should render the policy declaration field', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(
        container.querySelector('[data-testid="ezr-policy-declaration-field"]'),
      ).to.exist;
    });

    it('should render the form progress buttons', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(container.querySelector('.form-progress-buttons')).to.exist;
    });

    it('should not render the `update page` button', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(container.querySelector('[data-testid="ezr-update-button"]')).to
        .not.exist;
    });
  });

  context('when rendered on the review page', () => {
    const { props } = getData({
      providers: policyData.populated,
      onReviewPage: true,
    });

    it('should not render the policy declaration field', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(
        container.querySelector('[data-testid="ezr-policy-declaration-field"]'),
      ).to.not.exist;
    });

    it('should not render the form progress buttons', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(container.querySelector('.form-progress-buttons')).to.not.exist;
    });

    it('should render the `update page` button', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(container.querySelector('[data-testid="ezr-update-button"]')).to
        .exist;
    });
  });

  context('when the `Continue` button is clicked', () => {
    it('should not fire the `goForward` or `goToPath` spy without form data', () => {
      const { props } = getData({});
      const { container } = render(<InsuranceSummary {...props} />);
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(props.goForward.called).to.not.be.true;
      expect(props.goToPath.called).to.not.be.true;
    });

    it('should not fire the `goForward` or `goToPath` spy when there is already a validation error', () => {
      const { props } = getData({});
      const { container } = render(<InsuranceSummary {...props} />);
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(props.goForward.called).to.be.false;
      expect(props.goToPath.called).to.be.false;
      fireEvent.click(selector);
      expect(props.goForward.called).to.be.false;
      expect(props.goToPath.called).to.be.false;
    });

    [
      {
        description: 'missing both Insurance Policy and Group Code numbers',
        data: policyData.insuranceNumbersMissing,
      },
      {
        description: 'insurance name exceeds max length',
        data: policyData.insuranceNameTooLong,
      },
      {
        description: 'policy holder name exceeds max length',
        data: policyData.insurancePolicyHolderNameTooLong,
      },
      {
        description: 'policy number exceeds max length',
        data: policyData.insurancePolicyNumberTooLong,
      },
      {
        description: 'group code exceeds max length',
        data: policyData.insuranceGroupCodeTooLong,
      },
    ].forEach(({ description, data }) => {
      it(`should not fire the 'goForward' or 'goToPath' spy when there provider ${description} value is too long`, () => {
        const { props } = getData({
          providers: data,
          addPolicy: false,
        });
        const { container } = render(<InsuranceSummary {...props} />);
        const selector = container.querySelector('.usa-button-primary');
        fireEvent.click(selector);
        expect(props.goForward.called).to.be.false;
        expect(props.goToPath.called).to.be.false;
      });
    });

    it('should fire the `goForward` spy when the field value is set to `false`', () => {
      const { props } = getData({ addPolicy: false });
      const { container } = render(<InsuranceSummary {...props} />);
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(props.goToPath.called).to.be.false;
      expect(props.goForward.called).to.be.true;
    });

    it('should fire the `goToPath` spy when the field value is set to `true`', () => {
      const { props } = getData({ addPolicy: true });
      const { container } = render(<InsuranceSummary {...props} />);
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(props.goForward.called).to.be.false;
      expect(props.goToPath.called).to.be.true;
    });
  });

  context('when the form data changes', () => {
    it('should fire the `setFormData` spy', () => {
      const { props } = getData({});
      const { container } = render(<InsuranceSummary {...props} />);
      const selector = container.querySelector(
        '#root_view\\:addInsurancePolicyNo',
      );
      fireEvent.click(selector);
      expect(props.setFormData.called).to.be.true;
    });
  });

  context('when the user attempts to remove a policy record', () => {
    it('should fire the `setFormData` spy when confirming the action', async () => {
      const { props } = getData({ providers: policyData.populated });
      const { container } = render(<InsuranceSummary {...props} />);
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

    it('should not fire the `setFormData` spy when cancelling the action', async () => {
      const { props } = getData({ providers: policyData.populated });
      const { container } = render(<InsuranceSummary {...props} />);
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
