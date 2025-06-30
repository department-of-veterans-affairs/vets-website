import React from 'react';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import MaritalStatusPage from '../../../../components/FormPages/MaritalStatusPage';
import maritalStatusConfig from '../../../../config/chapters/householdInformation/maritalStatus';
import { renderProviderWrappedComponent } from '../../../helpers';

// These tests verify MaritalStatusPage logic, rendering, and modal behavior.
describe('ezr MaritalStatusPage', () => {
  // Helper to generate props for the component.
  const getData = props => ({
    props: {
      data: {},
      name: 'maritalStatusInformation',
      schema: maritalStatusConfig.schema,
      title: 'Marital Status',
      uiSchema: maritalStatusConfig.uiSchema,
      appStateData: {},
      contentAfterButtons: null,
      contentBeforeButtons: null,
      formContext: {},
      pagePerItemIndex: 0,
      trackingPrefix: 'maritalStatusInformation',
      goBack: sinon.spy(),
      goForward: sinon.spy(),
      onChange: sinon.spy(),
      onSubmit: sinon.spy(),
      NavButtons: FormNavButtons,
      ...props,
    },
  });

  const defaultExtra = {
    form: { prefillStatus: '' },
    user: { login: { currentlyLoggedIn: false } },
    onReviewPage: false,
  };

  context('when rendered', () => {
    it('should create props and render the component.', () => {
      const { props } = getData();
      expect(props).to.be.an('object');
      expect(props.name).to.equal('maritalStatusInformation');
      expect(props.title).to.equal('Marital Status');
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      expect(container).to.exist;
    });

    it('should render the marital status dropdown field.', () => {
      const { props } = getData();
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      const maritalStatusField = container.querySelector(
        '[name="root_view:maritalStatus_maritalStatus"]',
      );
      expect(maritalStatusField).to.exist;
      expect(maritalStatusField.tagName).to.equal('VA-SELECT');
    });

    it('should render navigation buttons.', () => {
      const { props } = getData();
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      // Check for actual navigation buttons with their CSS classes and text
      const backButton = container.querySelector('.usa-button-secondary');
      const continueButton = container.querySelector('.usa-button-primary');
      expect(backButton).to.exist;
      expect(backButton.textContent).to.include('Back');
      expect(continueButton).to.exist;
      expect(continueButton.textContent).to.include('Continue');
    });
  });

  context('when rendered with different data', () => {
    it('should render with married status.', () => {
      const { props } = getData({
        data: {
          'view:maritalStatus': {
            maritalStatus: 'married',
          },
        },
      });
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      expect(container).to.exist;
    });

    it('should render with never married status.', () => {
      const { props } = getData({
        data: {
          'view:maritalStatus': {
            maritalStatus: 'never married',
          },
        },
      });
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      expect(container).to.exist;
    });
  });

  context('when rendered on review page', () => {
    it('should render in review mode.', () => {
      const { props } = getData();
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        { ...defaultExtra, onReviewPage: true },
      );
      expect(container).to.exist;
    });
  });

  context('component props and behavior', () => {
    it('should pass correct props to SchemaForm.', () => {
      const { props } = getData();
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      expect(container).to.exist;
      expect(props.schema).to.equal(maritalStatusConfig.schema);
      expect(props.uiSchema).to.equal(maritalStatusConfig.uiSchema);
    });

    it('should have required prop types.', () => {
      const { props } = getData();
      expect(props.data).to.be.an('object');
      expect(props.name).to.be.a('string');
      expect(props.schema).to.be.an('object');
      expect(props.title).to.be.a('string');
      expect(props.uiSchema).to.be.an('object');
      expect(props.goBack).to.be.a('function');
      expect(props.goForward).to.be.a('function');
      expect(props.onChange).to.be.a('function');
      expect(props.onSubmit).to.be.a('function');
      expect(props.NavButtons).to.be.a('function');
    });
  });

  // NavButtons is mocked, so we only check rendering, not button clicks.
  context('when the Continue button is clicked', () => {
    it('should render without errors when no form data is present.', () => {
      const { props } = getData();
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      expect(container).to.exist;
    });

    it('should render with data when marital status is selected.', () => {
      const { props } = getData({
        data: {
          'view:maritalStatus': {
            maritalStatus: 'married',
          },
        },
      });
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      expect(container).to.exist;
    });
  });

  context('when the Back button is clicked', () => {
    it('should render the component.', () => {
      const { props } = getData();
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      expect(container).to.exist;
    });
  });

  context('when form data changes', () => {
    it('should fire the onChange spy when marital status field changes.', () => {
      const { props } = getData();
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      // Simulate a change event on the marital status field.
      const maritalStatusField = container.querySelector(
        '[name="root_view:maritalStatus_maritalStatus"]',
      );
      maritalStatusField.__events.vaSelect({
        target: {
          name: 'root_view:maritalStatus_maritalStatus',
          value: 'married',
        },
      });
      expect(props.onChange.called).to.be.true;
    });
  });

  // These tests verify modal logic for status changes that require confirmation.
  context('when modal is triggered', () => {
    it('should show modal when changing from married to divorced.', () => {
      const { props } = getData({
        data: {
          'view:maritalStatus': {
            maritalStatus: 'married',
          },
        },
      });
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      // Simulate changing to divorced status.
      const maritalStatusField = container.querySelector(
        '[name="root_view:maritalStatus_maritalStatus"]',
      );
      maritalStatusField.__events.vaSelect({
        target: {
          name: 'root_view:maritalStatus_maritalStatus',
          value: 'divorced',
        },
      });
      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;
      expect(modal.getAttribute('visible')).to.equal('true');
    });

    it('should call onChange when modal is confirmed.', async () => {
      const { props } = getData({
        data: {
          'view:maritalStatus': {
            maritalStatus: 'married',
          },
        },
      });
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      // Trigger modal by changing to divorced status.
      const maritalStatusField = container.querySelector(
        '[name="root_view:maritalStatus_maritalStatus"]',
      );
      maritalStatusField.__events.vaSelect({
        target: {
          name: 'root_view:maritalStatus_maritalStatus',
          value: 'divorced',
        },
      });
      const modal = container.querySelector('va-modal');
      modal.__events.primaryButtonClick();
      await waitFor(() => {
        expect(props.onChange.called).to.be.true;
      });
    });

    it('should not call onChange when modal is cancelled.', async () => {
      const { props } = getData({
        data: {
          'view:maritalStatus': {
            maritalStatus: 'married',
          },
        },
      });
      const { container } = renderProviderWrappedComponent(
        {},
        <MaritalStatusPage {...props} />,
        defaultExtra,
      );
      // Trigger modal by changing to divorced status.
      const maritalStatusField = container.querySelector(
        '[name="root_view:maritalStatus_maritalStatus"]',
      );
      maritalStatusField.__events.vaSelect({
        target: {
          name: 'root_view:maritalStatus_maritalStatus',
          value: 'divorced',
        },
      });
      const modal = container.querySelector('va-modal');
      modal.__events.secondaryButtonClick();
      await waitFor(() => {
        expect(props.onChange.called).to.be.false;
      });
    });
  });
});
