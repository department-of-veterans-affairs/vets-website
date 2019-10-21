import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { HCA_ENROLLMENT_STATUSES } from 'applications/hca//constants';

import {
  ReceiveTextMessages,
  mapStateToProps,
} from '../../containers/ReceiveTextMessages';

import { FIELD_NAMES } from '../../constants';

describe('<ReceiveTextMessages/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      getEnrollmentStatus() {},
      componentDidMount() {},
      profile: {
        verified: true,
        vet360: { mobilePhone: { isTextPermitted: false } },
      },
      hideMessage: false,
    };
  });

  it('renders nothing when conditions do not allow message to be rendered', () => {
    props.hideMessage = true;
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    expect(component.text()).to.be.equal('');
    component.unmount();
  });

  it('renders content when conditions do allow message to be rendered', () => {
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    expect(component.text()).to.not.be.equal('');
    component.unmount();
  });

  it('calls getEnrollmentStatus during componentDidMount when profile is verified', () => {
    sinon.stub(props, 'getEnrollmentStatus');
    const component = enzyme.shallow(<ReceiveTextMessages {...props} />);
    expect(
      props.getEnrollmentStatus.calledWith(),
      'getEnrollmentStatus was not called in componentDidMount',
    ).to.be.false;
    component.unmount();
  });

  describe('mapStateToProps', () => {
    let state = null;

    const ownProps = {
      title: 'Mobile Phone',
      fieldName: FIELD_NAMES.MOBILE_PHONE,
    };

    const transactionRequest = null;

    const mobilePhone = { isTextable: true, isTextPermitted: false };

    beforeEach(() => {
      state = {
        hcaEnrollmentStatus: {
          enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
        },
        user: {
          profile: {
            vet360: { mobilePhone: { mobilePhone } },
          },
        },
        vet360: {
          transactions: null,
          fieldTransactionMap: { mobilePhone: transactionRequest },
          transactionStatus: '',
        },
      };
    });

    it('returns the required props', () => {
      state.user.profile.vet360[FIELD_NAMES.MOBILE_PHONE] = mobilePhone;
      const result = mapStateToProps(state, ownProps);
      expect(result.profile.vet360.mobilePhone).to.be.equal(mobilePhone);
      expect(result.profile).to.be.equal(state.user.profile);
      expect(result.hideMessage).not.to.be.null;
    });

    it('returns hideMessage as true when user is not enrolled in va healthcare', () => {
      state.hcaEnrollmentStatus = null;
      const result = mapStateToProps(state, ownProps);
      expect(result.hideMessage).to.be.true;
    });

    it('returns hideMessage as true when user does not have a mobile phone', () => {
      state.user.profile.vet360.mobilePhone = null;
      const result = mapStateToProps(state, ownProps);
      expect(result.hideMessage).to.be.true;
    });

    it('returns hideMessage as true when users mobile phone is not textable', () => {
      state.user.profile.vet360.mobilePhone.isTextPermitted = false;
      const result = mapStateToProps(state, ownProps);
      expect(result.hideMessage).to.be.true;
    });
  });
});
