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

  it('calls componentWillReceiveProps with nextProps', () => {
    sinon.stub(props, 'componentWillReceiveProps');
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    const nextProps = props;
    expect(
      props.componentWillReceiveProps.calledWith(nextProps),
      'componentWillReceiveProps was called with nextProps',
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
