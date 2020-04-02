import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

import Vet360EditModal from '../../components/base/Vet360EditModal';

describe('<Vet360EditModal/>', () => {
  let props = null;
  let component = null;

  beforeEach(() => {
    props = {
      analyticsSectionName: 'some-field',
      clearErrors() {},
      getInitialFormValues() {},
      field: { value: {}, validations: {} },
      isEmpty() {},
      onBlur() {},
      onCancel() {},
      onChangeFormDataAndSchemas() {},
      onDelete() {},
      onSubmit() {},
      render() {},
      title: 'Edit Some Field',
      transaction: null,
      transactionRequest: null,
    };
  });

  it('renders with the correct props', () => {
    const initialFormValues = { someField: 'someFieldValue' };

    sinon.stub(props, 'getInitialFormValues').returns(initialFormValues);
    sinon.stub(props, 'onChangeFormDataAndSchemas');

    props.render = () => <div>Rendered output</div>;

    component = enzyme.shallow(<Vet360EditModal {...props} />);

    expect(
      props.onChangeFormDataAndSchemas.calledWith(initialFormValues),
      'onChange was called to initialize the modal with the result of getInitialFormValues',
    ).to.be.true;
    expect(
      component.html(),
      'The render prop was called and rendered into the component',
    ).to.contain('Rendered output');

    component.setProps({ field: null });
    expect(
      component.html(),
      'The render prop is not called when the field prop is falsey',
    ).to.not.contain('Rendered output');
    component.unmount();
  });

  describe('the `LoadingButton.isLoading`', () => {
    it('is `true` if the transactionRequest is pending', () => {
      props.transactionRequest = { isPending: true };
      props.render = actionButtons => actionButtons;
      component = enzyme.shallow(<Vet360EditModal {...props} />);

      const loadingButton = component.find(LoadingButton);
      expect(loadingButton.prop('isLoading')).to.be.true;

      component.unmount();
    });

    it('is `true` if the transaction is pending', () => {
      props.transaction = {
        data: {
          attributes: {
            transactionStatus: 'RECEIVED',
          },
        },
      };
      props.render = actionButtons => actionButtons;
      component = enzyme.shallow(<Vet360EditModal {...props} />);

      const loadingButton = component.find(LoadingButton);
      expect(loadingButton.prop('isLoading')).to.be.true;

      component.unmount();
    });

    it('is `false` if neither the transactionRequest or transaction are pending', () => {
      props.transactionRequest = { isPending: false };
      props.transaction = {
        data: {
          attributes: {
            transactionStatus: 'COMPLETED_SUCCESS',
          },
        },
      };
      props.render = actionButtons => actionButtons;
      component = enzyme.shallow(<Vet360EditModal {...props} />);

      const loadingButton = component.find(LoadingButton);
      expect(loadingButton.prop('isLoading')).to.be.false;

      component.unmount();
    });

    it('sets the LoadingButton to isLoading if the transaction is pending', () => {});
  });

  describe('Vet360EditModalErrorMessage', () => {
    it("is not shown if there isn't an error", () => {
      component = enzyme.shallow(<Vet360EditModal {...props} />);

      const errorMessage = component.find('Vet360EditModalErrorMessage');
      expect(errorMessage).to.have.lengthOf(0);

      component.unmount();
    });
    it('is shown if there is a transactionRequest error', () => {
      props.transactionRequest = { error: true };
      component = enzyme.shallow(<Vet360EditModal {...props} />);

      const errorMessage = component.find('Vet360EditModalErrorMessage');
      expect(errorMessage).to.have.lengthOf(1);

      component.unmount();
    });
    it('is shown if there is a transactionRequest error', () => {
      props.transactionRequest = { error: {} };
      component = enzyme.shallow(<Vet360EditModal {...props} />);

      const errorMessage = component.find('Vet360EditModalErrorMessage');
      expect(errorMessage).to.have.lengthOf(1);

      component.unmount();
    });
    it('is shown if there is a transaction error', () => {
      props.transaction = {
        data: {
          attributes: {
            transactionStatus: 'COMPLETED_FAILURE',
          },
        },
      };
      component = enzyme.shallow(<Vet360EditModal {...props} />);

      const errorMessage = component.find('Vet360EditModalErrorMessage');
      expect(errorMessage).to.have.lengthOf(1);

      component.unmount();
    });
  });
});
