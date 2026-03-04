import { expect } from 'chai';
import * as api from 'platform/utilities/api';
import sinon from 'sinon';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import * as actions from '../../actions';
import {
  ACKNOWLEDGE_DUPLICATE,
  FETCH_PERSONAL_INFORMATION,
  FETCH_DUPLICATE_CONTACT,
  FETCH_CLAIM_STATUS,
  CLAIM_STATUS_RESPONSE_IN_PROGRESS,
  UPDATE_GLOBAL_EMAIL,
  UPDATE_GLOBAL_PHONE_NUMBER,
  TOGGLE_MODAL,
  FETCH_DIRECT_DEPOSIT_SUCCESS,
  FETCH_DIRECT_DEPOSIT_FAILED,
  fetchPersonalInformation,
  fetchDuplicateContactInfo,
  updateGlobalEmail,
  updateGlobalPhoneNumber,
  acknowledgeDuplicate,
  toggleModal,
  fetchClaimStatus,
  fetchDirectDeposit,
} from '../../actions';

describe('Personal Information action', () => {
  it('should dispatch a fetch personal information action', () => {
    const mockData = { data: { attributes: { name: 'John Doe' } } };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return fetchPersonalInformation()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        FETCH_PERSONAL_INFORMATION,
      );
    });
  });
  it('should dispatch a fetch error', () => {
    mockApiRequest({}, false);
    const dispatch = sinon.spy();
    return fetchPersonalInformation()(dispatch).then(() => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('object');
    });
  });
});
describe('Duplicate Contact Info action', () => {
  const email = 'test@example.com';
  const phoneNumber = '1234567890';
  it('should dispatch a fetch duplicate contact action', () => {
    const mockData = { data: { duplicates: [] } };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return fetchDuplicateContactInfo(email, phoneNumber)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(FETCH_DUPLICATE_CONTACT);
    });
  });
  it('should dispatch a fetch error', () => {
    mockApiRequest({}, false);
    const dispatch = sinon.spy();
    return fetchDuplicateContactInfo(email, phoneNumber)(dispatch).then(() => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('object');
    });
  });
});
describe('Claim Status action', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const selectedChapter = 'Chapter35';
  it('should dispatch a fetch claim status action', () => {
    const mockData = {
      data: {
        attributes: {
          claimStatus: 'COMPLETED',
          receivedDate: '2024-01-01',
        },
      },
    };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return fetchClaimStatus(selectedChapter)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(FETCH_CLAIM_STATUS);
    });
  });

  it('should handle fetch claim status eror', () => {
    sandbox.stub(api, 'apiRequest').rejects(new Error('Network Error'));
    const dispatch = sinon.spy();

    return fetchClaimStatus(selectedChapter)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(FETCH_CLAIM_STATUS);
    });
  });

  xit('should handle polling timeout', function() {
    this.timeout(5000);
    const mockData = {
      data: {
        attributes: {
          claimStatus: CLAIM_STATUS_RESPONSE_IN_PROGRESS,
          receivedDate: '2024-01-01',
        },
      },
    };
    sandbox.stub(api, 'apiRequest').resolves(mockData);
    const dispatch = sinon.spy();
    const pastTime = new Date(Date.now() - 1000);
    sandbox.stub(actions, 'ONE_MINUTE_IN_THE_FUTURE').returns(pastTime);

    return actions
      .fetchClaimStatus(selectedChapter)(dispatch)
      .then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(FETCH_CLAIM_STATUS);
        const successAction = dispatch.getCall(1).args[0];
        expect(successAction.type).equal(actions.FETCH_CLAIM_STATUS_SUCCESS);

        actions.ONE_MINUTE_IN_THE_FUTURE.restore();
      });
  });
});
describe('Update Global Email action', () => {
  it('should create an update global email action', () => {
    const email = 'test@example.com';
    const action = updateGlobalEmail(email);
    expect(action.type).to.equal(UPDATE_GLOBAL_EMAIL);
    expect(action.email).to.equal(email);
  });
});
describe('Update Global Phone Number action', () => {
  it('should create an update global phone number action', () => {
    const mobilePhone = '1234567890';
    const action = updateGlobalPhoneNumber(mobilePhone);
    expect(action.type).to.equal(UPDATE_GLOBAL_PHONE_NUMBER);
    expect(action.mobilePhone).to.equal(mobilePhone);
  });
});
describe('Acknowledge Duplicate action', () => {
  it('should create an acknowledge duplicate action', () => {
    const contactInfo = { email: 'test@example.com', phone: '1234567890' };
    const action = acknowledgeDuplicate(contactInfo);
    expect(action.type).to.equal(ACKNOWLEDGE_DUPLICATE);
    expect(action.contactInfo).to.equal(contactInfo);
  });
});
describe('Toggle Modal action', () => {
  it('should create a toggle modal action', () => {
    const toggle = true;
    const action = toggleModal(toggle);
    expect(action.type).to.equal(TOGGLE_MODAL);
    expect(action.toggle).to.equal(toggle);
  });
});

describe('Fetch Direct Deposit action', () => {
  it('should dispatch a fetch direct deposit information action', () => {
    const mockData = { data: { attributes: { name: 'John Doe' } } };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return fetchDirectDeposit()(dispatch).then(() => {
      expect(dispatch.secondCall.args[0].type).to.equal(
        FETCH_DIRECT_DEPOSIT_SUCCESS,
      );
    });
  });
  it('should dispatch a fetch error', () => {
    mockApiRequest({}, false);
    const dispatch = sinon.spy();
    return fetchDirectDeposit()(dispatch).then(() => {
      expect(dispatch.secondCall.args[0].type).to.equal(
        FETCH_DIRECT_DEPOSIT_FAILED,
      );
    });
  });
});
