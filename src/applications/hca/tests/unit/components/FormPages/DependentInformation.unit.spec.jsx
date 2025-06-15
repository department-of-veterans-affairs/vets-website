import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentInformation from '../../../../components/FormPages/DependentInformation';
import { simulateInputChange } from '../../../helpers';

describe('hca DependentInformation page', () => {
  const getData = ({ dependents = undefined }) => ({
    props: {
      data: { dependents },
      goToPath: sinon.spy(),
      setFormData: sinon.spy(),
    },
    mockStore: {
      getState: () => ({
        form: {
          data: {},
          loadedData: {
            metadata: {},
          },
          lastSavedDate: null,
          migrations: [],
          prefillTransformer: null,
        },
        user: {
          login: { currentlyLoggedIn: false },
          profile: {
            loading: false,
            loa: { current: null },
            savedForms: [],
            prefillsAvailable: [],
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  context('when the component renders', () => {
    it('should render form object with the correct title', () => {
      const { mockStore, props } = getData({ dependents: [] });
      const { container } = render(
        <Provider store={mockStore}>
          <DependentInformation {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.rjsf');
      expect(selector).to.exist;
    });

    it('should render cancel button to trigger confirmation modal', () => {
      const { mockStore, props } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
          <DependentInformation {...props} />
        </Provider>,
      );
      const selector = container.querySelector('#hca-modal-cancel');
      expect(selector).to.exist;
    });

    it('should render form navigation buttons', () => {
      const { mockStore, props } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
          <DependentInformation {...props} />
        </Provider>,
      );
      const selectors = {
        backBtn: container.querySelector('.usa-button-secondary'),
        continueBtn: container.querySelector('.usa-button-primary'),
      };
      expect(selectors.backBtn).to.exist;
      expect(selectors.continueBtn).to.exist;
    });
  });

  context(
    'when the `Continue` button is clicked from the first page with form data',
    () => {
      it('should trigger the cancel modal', async () => {
        const { mockStore, props } = getData({ dependents: [] });
        const { container } = render(
          <Provider store={mockStore}>
            <DependentInformation {...props} />
          </Provider>,
        );
        const selector = container.querySelector('.usa-button-primary');

        simulateInputChange(container, '#root_fullName_first', 'Jane');
        simulateInputChange(container, '#root_fullName_last', 'Smith');
        simulateInputChange(container, '#root_dependentRelation', 'Daughter');
        simulateInputChange(
          container,
          '#root_socialSecurityNumber',
          '234243444',
        );
        simulateInputChange(container, '#root_dateOfBirthMonth', '1');
        simulateInputChange(container, '#root_dateOfBirthDay', '1');
        simulateInputChange(container, '#root_dateOfBirthYear', '2000');
        simulateInputChange(container, '#root_becameDependentMonth', '1');
        simulateInputChange(container, '#root_becameDependentDay', '1');
        simulateInputChange(container, '#root_becameDependentYear', '2000');

        fireEvent.click(selector);

        await waitFor(() => {
          expect(props.goToPath.called).to.be.false;
          expect(props.setFormData.called).to.be.false;
        });
      });
    },
  );

  context('when the `Cancel` button is clicked', () => {
    it('should trigger the modal and fire `goToPath` when confirming the action', async () => {
      const { mockStore, props } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
          <DependentInformation {...props} />
        </Provider>,
      );
      const selectors = {
        cancelBtn: container.querySelector('#hca-modal-cancel'),
        modal: container.querySelector('va-modal'),
      };

      fireEvent.click(selectors.cancelBtn);
      selectors.modal.__events.primaryButtonClick();

      await waitFor(() => {
        expect(props.goToPath.called).to.be.true;
      });
    });

    it('should trigger the modal and not fire `goToPath` when cancelling the action', async () => {
      const { mockStore, props } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
          <DependentInformation {...props} />
        </Provider>,
      );
      const selectors = {
        cancelBtn: container.querySelector('#hca-modal-cancel'),
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
      const { mockStore, props } = getData({ dependents: [] });
      const { container } = render(
        <Provider store={mockStore}>
          <DependentInformation {...props} />
        </Provider>,
      );
      const selectors = {
        backBtn: container.querySelector('.usa-button-secondary'),
        modal: container.querySelector('va-modal'),
        firstName: container.querySelector('[name="root_fullName_first"]'),
        lastName: container.querySelector('[name="root_fullName_last"]'),
        ssn: container.querySelector('[name="root_socialSecurityNumber"]'),
      };

      fireEvent.click(selectors.backBtn);

      await waitFor(() => {
        expect(selectors.modal).to.have.attr('visible', 'true');
      });
    });
  });
});
