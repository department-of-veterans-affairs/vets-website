import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { waitFor } from '@testing-library/react';
import SuggestedAddress from '../../components/SuggestedAddress';
import * as actionCreators from '../../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('<SuggestedAddress />', () => {
  let store;
  let useDispatchMock;
  let useSelectorMock;
  let validateAddressStub;
  const mockInitialState = {
    addressValidation: {
      isLoadingValidateAddress: false,
      addressValidationData: {
        addresses: [
          {
            addressMetaData: {
              deliveryPointValidation: 'CONFIRMED',
              confidenceScore: 95,
            },
          },
        ],
      },
    },
    updateAddress: {
      loading: false,
    },
  };

  beforeEach(() => {
    useSelectorMock = sinon.stub(redux, 'useSelector');
    useDispatchMock = sinon.stub(redux, 'useDispatch').returns(() => {});
    store = mockStore(mockInitialState);
    useSelectorMock.callsFake(selector => selector(mockInitialState));
    validateAddressStub = sinon.stub(actionCreators, 'validateAddress');
  });

  afterEach(() => {
    useDispatchMock.restore();
    useSelectorMock.restore();
    validateAddressStub.restore();
  });
  it('renders without crashing', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <SuggestedAddress
          formData={{}}
          address={{}}
          scrollToTopOfForm={() => {}}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(wrapper.find('.address-change-form-container').exists()).to.be
        .true;
      wrapper.unmount();
    });
  });

  it('should shows loader when addresses are being validated or updated', async () => {
    useSelectorMock.callsFake(selector =>
      selector({
        ...mockInitialState,
        addressValidation: {
          ...mockInitialState.addressValidation,
          isLoadingValidateAddress: true,
        },
        updateAddress: { ...mockInitialState.updateAddress, loading: false },
      }),
    );

    const wrapper = mount(
      <Provider store={store}>
        <SuggestedAddress
          formData={{}}
          address={{}}
          scrollToTopOfForm={() => {}}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(wrapper.find('.loader').exists()).to.be.true;
      wrapper.unmount();
    });
  });
  it('should calls setChooseAddress with the right value on radio button change', async () => {
    const setChooseAddress = sinon.spy();
    const wrapper = mount(
      <Provider store={store}>
        <SuggestedAddress
          formData={{}}
          address={{}}
          setChooseAddress={setChooseAddress}
          scrollToTopOfForm={() => {}}
        />
      </Provider>,
    );
    const radioInput = wrapper.find('input#entered-address');
    radioInput.simulate('change', { target: { value: 'entered' } });
    await waitFor(() => {
      expect(setChooseAddress.calledWith('entered')).to.be.false;
      wrapper.unmount();
    });
  });
  it('should dispatches validateAddress and sets suggested address picked for suggested address', async () => {
    validateAddressStub.returns(() => Promise.resolve());
    const setSuggestedAddressPicked = sinon.spy();
    const setFormData = sinon.spy();
    const dispatch = sinon.spy();
    useDispatchMock.returns(dispatch);

    const wrapper = mount(
      <Provider store={store}>
        <SuggestedAddress
          formData={{ countryCodeIso3: 'USA' }}
          address={{}}
          setSuggestedAddressPicked={setSuggestedAddressPicked}
          setFormData={setFormData}
          suggestedAddressPicked={false}
          scrollToTopOfForm={() => {}}
        />
      </Provider>,
    );

    await wrapper
      .find('ButtonsGroup')
      .props()
      .onPrimaryClick();
    expect(setSuggestedAddressPicked.calledWith(true)).to.be.true;
    expect(validateAddressStub.called).to.be.true;
    expect(setFormData.calledWith({})).to.be.true;
    wrapper.unmount();
  });
  it('should dispatches postMailingAddress and resets validation for entered address', async () => {
    const setFormData = sinon.spy();
    const setAddressToUI = sinon.spy();
    const postMailingAddress = sinon
      .stub(actionCreators, 'postMailingAddress')
      .returns(() => Promise.resolve());
    const dispatch = sinon.spy();
    useDispatchMock.returns(dispatch);

    const formData = {
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4',
      city: 'Anytown',
      stateCode: 'NY',
      zipCode: '12345',
      countryCodeIso3: 'USA',
    };

    const wrapper = mount(
      <Provider store={store}>
        <SuggestedAddress
          formData={formData}
          address={{}}
          setFormData={setFormData}
          setAddressToUI={setAddressToUI}
          suggestedAddressPicked={false}
          scrollToTopOfForm={() => {}}
          applicantName="John Doe"
        />
      </Provider>,
    );

    wrapper
      .find('input#entered-address')
      .simulate('change', { target: { value: 'entered' } });
    await wrapper
      .find('ButtonsGroup')
      .props()
      .onPrimaryClick();

    sinon.assert.calledWith(
      postMailingAddress,
      sinon.match.has('veteranName', 'John Doe'),
    );
    sinon.assert.calledWith(setFormData, {});
    sinon.assert.calledWith(
      dispatch,
      sinon.match.has('type', 'RESET_ADDRESS_VALIDATIONS'),
    );
    sinon.assert.calledWith(
      setAddressToUI,
      sinon.match.has('street', '123 Main St Apt 4'),
    );
    wrapper.unmount();
  });
  it('should calls handleAddNewClick when go back to edit button is clicked', async () => {
    const handleAddNewClick = sinon.spy();
    const setGoBackToEdit = sinon.spy();
    const wrapper = mount(
      <Provider store={store}>
        <SuggestedAddress
          formData={{}}
          address={{}}
          handleAddNewClick={handleAddNewClick}
          setGoBackToEdit={setGoBackToEdit}
          scrollToTopOfForm={() => {}}
        />
      </Provider>,
    );

    wrapper
      .find('va-button')
      .at(1)
      .simulate('click');
    await waitFor(() => {
      expect(handleAddNewClick.calledOnce).to.be.true;
      wrapper.unmount();
    });
  });

  it('shoul handles errors during validateAddress dispatch', async () => {
    validateAddressStub.returns(() => Promise.reject());
    const setSuggestedAddressPicked = sinon.spy();
    const setFormData = sinon.spy();
    const dispatch = sinon.spy();
    useDispatchMock.returns(dispatch);

    const wrapper = mount(
      <Provider store={store}>
        <SuggestedAddress
          formData={{ fullName: 'John Doe' }}
          address={{
            fullName: 'John Doe',
            addressLine1: '123 Main St',
            addressLine2: 'Apt 4',
            city: 'Anytown',
            stateCode: 'NY',
            zipCode: '12345',
            countryCodeIso3: 'USA',
          }}
          setSuggestedAddressPicked={setSuggestedAddressPicked}
          setFormData={setFormData}
          scrollToTopOfForm={() => {}}
        />
      </Provider>,
    );
    wrapper
      .find('input#suggested-address')
      .simulate('change', { target: { checked: true } });
    wrapper
      .find('va-button')
      .at(0)
      .simulate('click');

    await waitFor(() => {
      expect(dispatch.calledWith(sinon.match.func)).to.be.true;
      expect(validateAddressStub.called).to.be.false;
      expect(setFormData.calledWith({})).to.be.true;
      wrapper.unmount();
    });
  });
  it('shoul sets the primary button label correctly based on address validation and selection', async () => {
    const mockFormData = {
      fullName: 'John Doe',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4',
      city: 'Anytown',
      stateCode: 'NY',
      zipCode: '12345',
      countryCodeIso3: 'USA',
    };
    const mockAddress = {};
    const mockAddressValidationData = {
      addresses: [
        {
          addressMetaData: {
            deliveryPointValidation: 'CONFIRMED',
            confidenceScore: 95,
          },
        },
      ],
    };

    useSelectorMock.callsFake(selector =>
      selector({
        ...mockInitialState,
        addressValidation: {
          ...mockInitialState.addressValidation,
          addressValidationData: mockAddressValidationData,
        },
      }),
    );

    let wrapper = mount(
      <Provider store={store}>
        <SuggestedAddress
          formData={mockFormData}
          address={mockAddress}
          suggestedAddressPicked
          scrollToTopOfForm={() => {}}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(wrapper.find('ButtonsGroup').prop('primaryLabel')).to.equal(
        'Update',
      );
      wrapper.unmount();
    });

    useSelectorMock.callsFake(selector =>
      selector({
        ...mockInitialState,
        addressValidation: {
          ...mockInitialState.addressValidation,
          addressValidationData: {
            ...mockAddressValidationData,
            addresses: [
              { addressMetaData: { deliveryPointValidation: 'UNCONFIRMED' } },
            ],
          },
        },
      }),
    );

    wrapper = mount(
      <Provider store={store}>
        <SuggestedAddress
          formData={mockFormData}
          address={mockAddress}
          suggestedAddressPicked={false}
          scrollToTopOfForm={() => {}}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(wrapper.find('ButtonsGroup').prop('primaryLabel')).to.equal(
        'Use this address',
      );
      wrapper.unmount();
    });
  });
});
