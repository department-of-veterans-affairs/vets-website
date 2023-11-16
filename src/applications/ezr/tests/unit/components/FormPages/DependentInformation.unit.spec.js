import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentInformation from '../../../../components/FormPages/DependentInformation';
import { inputVaTextInput } from '../../../helpers';

describe('ezr DependentInformation page', () => {
  const getData = ({ dependents = undefined }) => ({
    props: {
      data: { dependents },
      goToPath: sinon.spy(),
      setFormData: sinon.spy(),
    },
  });

  context('when the component renders', () => {
    it('should render form object with the correct title', () => {
      const { props } = getData({ dependents: [] });
      const { container } = render(<DependentInformation {...props} />);
      const selector = container.querySelector('.rjsf');
      expect(selector).to.exist;
    });

    it('should render cancel button to trigger confirmation modal', () => {
      const { props } = getData({});
      const { container } = render(<DependentInformation {...props} />);
      const selector = container.querySelector('#ezr-modal-cancel');
      expect(selector).to.exist;
    });

    it('should render form navigation buttons', () => {
      const { props } = getData({});
      const { container } = render(<DependentInformation {...props} />);
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
      const { container } = render(<DependentInformation {...props} />);
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
      const { container } = render(<DependentInformation {...props} />);
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
      const { props } = getData({ dependents: [] });
      const { container } = render(<DependentInformation {...props} />);
      const selectors = {
        backBtn: container.querySelector('.usa-button-secondary'),
        modal: container.querySelector('va-modal'),
        firstName: container.querySelector('[name="root_fullName_first"]'),
        lastName: container.querySelector('[name="root_fullName_last"]'),
        ssn: container.querySelector('[name="root_socialSecurityNumber"]'),
      };

      inputVaTextInput(selectors.firstName, 'Jane');
      inputVaTextInput(selectors.lastName, 'Smith');
      inputVaTextInput(selectors.ssn, '211111111');

      fireEvent.click(selectors.backBtn);

      await waitFor(() => {
        expect(selectors.modal).to.have.attr('visible', 'true');
      });
    });
  });
});
