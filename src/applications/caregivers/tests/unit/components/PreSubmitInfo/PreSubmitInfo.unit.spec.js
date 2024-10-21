import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { inputVaTextInput } from 'platform/testing/unit/helpers';
import PreSubmitInfo from '../../../../components/PreSubmitInfo';

describe('CG <PreSubmitCheckboxGroup>', () => {
  const getData = ({
    dispatch = () => {},
    hasSecondaryOne = false,
    hasSecondaryTwo = false,
    signAsRepresentativeYesNo = 'no',
    status = false,
  } = {}) => ({
    props: {
      onSectionComplete: sinon.spy(),
      formData: {
        primaryFullName: {
          first: 'Mary',
          middle: '',
          last: 'Smith',
        },
        secondaryOneFullName: {
          first: 'Joe',
          middle: '',
          last: 'Smith',
        },
        secondaryTwoFullName: {
          first: 'Nikki',
          middle: '',
          last: 'Smith',
        },
        veteranFullName: {
          first: 'John',
          middle: '',
          last: 'Smith',
        },
        signAsRepresentativeYesNo,
        'view:hasPrimaryCaregiver': true,
        'view:hasSecondaryCaregiverOne': hasSecondaryOne,
        'view:hasSecondaryCaregiverTwo': hasSecondaryTwo,
      },
      showError: false,
    },
    mockStore: {
      getState: () => ({
        form: { submission: { status } },
      }),
      subscribe: () => {},
      dispatch,
    },
  });
  const subject = ({ mockStore, props }) => {
    const { container } = render(
      <Provider store={mockStore}>
        <PreSubmitInfo.CustomComponent {...props} />
      </Provider>,
    );
    const selectors = () => ({
      signatureBoxes: container.querySelectorAll('.signature-box'),
      vaCheckboxes: container.querySelectorAll('va-checkbox'),
      vaTextInputs: container.querySelectorAll('va-text-input'),
    });
    return { container, selectors };
  };

  context('when a representative is signing for the Veteran', () => {
    it('should render the appropriate `va-text-input` label for the Veteran signature', () => {
      const { mockStore, props } = getData({
        signAsRepresentativeYesNo: 'yes',
      });
      const { selectors } = subject({ mockStore, props });
      const { vaTextInputs } = selectors();
      expect(vaTextInputs[0]).to.have.attr(
        'label',
        'Enter your name to sign as the Veteran’s representative',
      );
    });
  });

  context('when the Veteran is signing for themselves', () => {
    it('should render the appropriate `va-text-input` label for the Veteran signature', () => {
      const { mockStore, props } = getData({});
      const { selectors } = subject({ mockStore, props });
      const { vaTextInputs } = selectors();
      expect(vaTextInputs[0]).to.have.attr('label', 'Veteran’s full name');
    });
  });

  context('when secondary caregivers are named in the application', () => {
    it('should render the appropriate number of signature checkbox components', () => {
      const { mockStore, props } = getData({
        hasSecondaryOne: true,
        hasSecondaryTwo: true,
      });
      const { selectors } = subject({ mockStore, props });
      expect(selectors().signatureBoxes).to.have.lengthOf(4);
    });
  });

  context('when a change is made to a `va-text-input` component', () => {
    let dispatch;

    beforeEach(() => {
      dispatch = sinon.stub();
    });

    it('should not set new form data when the form has been submitted', async () => {
      const { mockStore, props } = getData({ status: true, dispatch });
      const { container, selectors } = subject({ mockStore, props });
      await waitFor(() => {
        const { vaTextInputs } = selectors();
        inputVaTextInput(container, 'John Smith', vaTextInputs[0]);
        expect(dispatch.called).to.be.false;
      });
    });

    it('should set new form data when the form has not been submitted', async () => {
      const { mockStore, props } = getData({ dispatch });
      const { container, selectors } = subject({ mockStore, props });
      await waitFor(() => {
        const { vaTextInputs } = selectors();
        inputVaTextInput(container, 'John Smith', vaTextInputs[0]);
        expect(dispatch.called).to.be.true;
      });
    });
  });
});
