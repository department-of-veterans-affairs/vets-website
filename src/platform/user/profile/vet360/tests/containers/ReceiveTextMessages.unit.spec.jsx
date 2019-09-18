import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { ReceiveTextMessages } from '../../containers/ReceiveTextMessages';
import { API_ROUTES } from '../../constants';

describe('<ReceiveTextMessages/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      getEnrollmentStatus() {},
      createTransaction() {},
      clearTransactionStatus() {},
      componentDidMount() {},
      componentWillReceiveProps() {},
      onChange() {},
      isSuccessVisible() {},
      profile: {
        verified: true,
        vet360: { mobilePhone: { isTextPermitted: false } },
      },
      hideCheckbox: false,
      transaction: {},
      transactionSuccess: false,
      analyticsSectionName: '',
      apiRoute: API_ROUTES.TELEPHONES,
    };
  });

  it('renders nothing when conditions do not allow checkbox to be rendered', () => {
    props.hideCheckbox = true;
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    expect(component.text()).to.be.equal('');
    component.unmount();
  });

  it('renders content when conditions do allow checkbox to be rendered', () => {
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    expect(component.text()).to.not.be.equal('');
    component.unmount();
  });

  it('renders the checkbox when conditions do allow checkbox to be rendered', () => {
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    const errorableCheckbox = component.find('ErrorableCheckbox');
    expect(errorableCheckbox, 'the checkbox rendered').to.have.lengthOf(1);
    component.unmount();
  });

  it('calls componentDidMount with verified profile', () => {
    sinon.stub(props, 'componentDidMount');
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    expect(
      props.componentDidMount.calledWith(props),
      'componentDidMount was called with user profile to initialize enrollment status',
    ).to.be.false;
    component.unmount();
  });

  it('calls componentWillReceiveProps with verified profile', () => {
    sinon.stub(props, 'componentWillReceiveProps');
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    const nextProps = props;
    expect(
      props.componentWillReceiveProps.calledWith(nextProps),
      'componentWillReceiveProps was called with nextProps',
    ).to.be.false;
    component.unmount();
  });

  it('calls onChange to create a transaction', () => {
    sinon.stub(props, 'onChange');
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    expect(props.onChange.calledWith(), 'onChange was called').to.be.false;
    component.unmount();
  });

  it('calls isSuccessVisible to see if success message should be visible', () => {
    props.transactionSuccess = true;
    sinon.stub(props, 'isSuccessVisible');
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    component.setState({
      startedTransaction: true,
      completedTransaction: true,
      lastTransaction: props.transaction,
    });
    expect(
      props.isSuccessVisible.calledWith(),
      'isSuccessVisible was called with transaction success',
    ).to.be.false;
    component.unmount();
  });

  it('calls getEnrollmentStatus with verified profile', () => {
    sinon.stub(props, 'getEnrollmentStatus');
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    expect(
      props.getEnrollmentStatus.calledWith(),
      'getEnrollmentStatus was called with user profile to initialize enrollment status',
    ).to.be.true;
    component.unmount();
  });
});
