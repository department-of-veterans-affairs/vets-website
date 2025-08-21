import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import InsurancePolicyInformation from '../../../../components/FormPages/InsurancePolicyInformation';
import { inputVaTextInput } from '../../../helpers';
import content from '../../../../locales/en/content.json';

describe('ezr InsurancePolicyInformation', () => {
  const getData = ({ providers = undefined }) => ({
    props: {
      data: { providers },
      goToPath: sinon.spy(),
      setFormData: sinon.spy(),
    },
  });

  context('when the component renders', () => {
    it('should render form object with the correct title', () => {
      const { props } = getData({ providers: [] });
      const { container } = render(<InsurancePolicyInformation {...props} />);
      const selectors = {
        form: container.querySelector('.rjsf'),
        title: container.querySelector('.schemaform-block-title'),
      };
      expect(selectors.form).to.exist;
      expect(selectors.title).to.contain.text(
        content['insurance-policy-information-title'],
      );
    });

    it('should render cancel button to trigger confirmation modal', () => {
      const { props } = getData({});
      const { container } = render(<InsurancePolicyInformation {...props} />);
      const selector = container.querySelector('#ezr-modal-cancel');
      expect(selector).to.exist;
    });

    it('should render form navigation buttons', () => {
      const { props } = getData({});
      const { container } = render(<InsurancePolicyInformation {...props} />);
      const selectors = {
        backBtn: container.querySelector('.usa-button-secondary'),
        continueBtn: container.querySelector('.usa-button-primary'),
      };
      expect(selectors.backBtn).to.exist;
      expect(selectors.continueBtn).to.exist;
    });
  });

  context('when the `Cancel` button is clicked', () => {
    it('should trigger the modal and fire `goToPath` when confirming the action', async () => {
      const { props } = getData({});
      const { container } = render(<InsurancePolicyInformation {...props} />);
      const selectors = {
        cancelBtn: container.querySelector('#ezr-modal-cancel'),
        modal: container.querySelector('va-modal'),
      };

      fireEvent.click(selectors.cancelBtn);
      selectors.modal.__events.primaryButtonClick();

      await waitFor(() => {
        expect(props.goToPath.called).to.be.true;
      });
    });

    it('should trigger the modal and not fire `goToPath` when cancelling the action', async () => {
      const { props } = getData({});
      const { container } = render(<InsurancePolicyInformation {...props} />);
      const selectors = {
        cancelBtn: container.querySelector('#ezr-modal-cancel'),
        modal: container.querySelector('va-modal'),
      };

      fireEvent.click(selectors.cancelBtn);
      selectors.modal.__events.secondaryButtonClick();

      await waitFor(() => {
        expect(props.setFormData.called).to.be.false;
        expect(props.goToPath.called).to.be.false;
      });
    });
  });

  context('when the `Back` button is clicked', () => {
    it('should trigger the cancel modal', async () => {
      const { props } = getData({ providers: [] });
      const { container } = render(<InsurancePolicyInformation {...props} />);
      const selectors = {
        backBtn: container.querySelector('.usa-button-secondary'),
        modal: container.querySelector('va-modal'),
      };

      fireEvent.click(selectors.backBtn);

      await waitFor(() => {
        expect(selectors.modal).to.have.attr('visible', 'true');
      });
    });
  });

  context('when the `Continue` button is clicked', () => {
    it('should call `setFormData` and `goToPath` spies with valid data', async () => {
      const { props } = getData({});
      const { container } = render(<InsurancePolicyInformation {...props} />);
      const selectors = {
        continueBtn: container.querySelector('.usa-button-primary'),
        inputs: {
          insuranceName: container.querySelector('[name="root_insuranceName"]'),
          insurancePolicyHolderName: container.querySelector(
            '[name="root_insurancePolicyHolderName"]',
          ),
          insurancePolicyNumber: container.querySelector(
            '[name="root_view:policyOrGroup_insurancePolicyNumber"]',
          ),
        },
      };

      inputVaTextInput(selectors.inputs.insuranceName, 'Cigna');
      inputVaTextInput(
        selectors.inputs.insurancePolicyHolderName,
        'John Smith',
      );
      inputVaTextInput(selectors.inputs.insurancePolicyNumber, '006655');

      fireEvent.click(selectors.continueBtn);

      await waitFor(() => {
        expect(props.setFormData.called).to.be.true;
        expect(props.goToPath.called).to.be.true;
      });
    });
  });
});
