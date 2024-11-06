import { expect } from 'chai';
import sinon from 'sinon';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  ACKNOWLEDGE_DUPLICATE,
  FETCH_PERSONAL_INFORMATION,
  FETCH_DUPLICATE_CONTACT,
  FETCH_CLAIM_STATUS,
  CLAIM_STATUS_RESPONSE_IN_PROGRESS,
  UPDATE_GLOBAL_EMAIL,
  UPDATE_GLOBAL_PHONE_NUMBER,
  TOGGLE_MODAL,
  fetchPersonalInformation,
  fetchDuplicateContactInfo,
  updateGlobalEmail,
  updateGlobalPhoneNumber,
  acknowledgeDuplicate,
  toggleModal,
  fetchClaimStatus,
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
  xit('should handle polling timeout', () => {
    const mockData = {
      data: {
        attributes: {
          claimStatus: CLAIM_STATUS_RESPONSE_IN_PROGRESS,
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
