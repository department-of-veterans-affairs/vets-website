import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { getAllTriageTeamRecipients } from '../../actions/recipients';
import * as allRecipientsTriageTeamsResponse from '../e2e/fixtures/all-recipients-response.json';

describe('triageTeam actions', () => {
  const middlewares = [thunk];
  const mockStore = (initialState = { featureToggles: {} }) =>
    configureStore(middlewares)(initialState);

  it('should dispatch action on getAllTriageTeamRecipients', () => {
    const store = mockStore();
    mockApiRequest(allRecipientsTriageTeamsResponse);
    store.dispatch(getAllTriageTeamRecipients()).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal({
        type: Actions.AllRecipients.GET_LIST,
        payload: allRecipientsTriageTeamsResponse,
      });
    });
  });
  it('should dispatch action on getAllTriageTeamRecipients error', () => {
    const store = mockStore();
    mockApiRequest({}, false);
    store.dispatch(getAllTriageTeamRecipients()).catch(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal({
        type: Actions.AllRecipients.GET_LIST_ERROR,
      });
    });
  });

  describe('signature requirement logic', () => {
    it('should add signatureRequired=true for Privacy Issue_Admin recipients', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: { name: 'Privacy Issue_Admin' },
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();
        expect(
          actions[0].response.data[0].attributes.signatureRequired,
        ).to.equal(true);
      });
    });

    it('should add signatureRequired=true for Record Amendment_Admin recipients', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: { name: 'Record Amendment_Admin' },
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();
        expect(
          actions[0].response.data[0].attributes.signatureRequired,
        ).to.equal(true);
      });
    });

    it('should add signatureRequired=true for Release of Information Medical Records_Admin recipients', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: {
              name: 'Release of Information Medical Records_Admin',
            },
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();
        expect(
          actions[0].response.data[0].attributes.signatureRequired,
        ).to.equal(true);
      });
    });

    it('should add signatureRequired=true for Oracle Health Release of Information patterns (without _Admin)', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: { name: 'VHA 123 Release of Information (ROI)' },
          },
          {
            id: '2',
            attributes: {
              name: 'State City Release of Information – Medical Records',
            },
          },
          {
            id: '3',
            attributes: { name: 'Some Release of Information Team' },
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();

        // All Oracle Health ROI patterns should require signature
        expect(
          actions[0].response.data[0].attributes.signatureRequired,
        ).to.equal(true);
        expect(
          actions[0].response.data[1].attributes.signatureRequired,
        ).to.equal(true);
        expect(
          actions[0].response.data[2].attributes.signatureRequired,
        ).to.equal(true);
      });
    });

    it('should NOT add signatureRequired for regular team names', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: { name: 'Regular Team Name' },
          },
          {
            id: '2',
            attributes: { name: 'Privacy Issue Department' }, // Missing _Admin
          },
          {
            id: '3',
            attributes: { name: 'Cardiology Team' },
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();

        // Regular teams should not have signatureRequired property
        expect(actions[0].response.data[0].attributes.signatureRequired).to.be
          .undefined;
        expect(actions[0].response.data[1].attributes.signatureRequired).to.be
          .undefined;
        expect(actions[0].response.data[2].attributes.signatureRequired).to.be
          .undefined;
      });
    });

    it('should handle mixed recipient types correctly', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            attributes: { name: 'Privacy Issues_Admin' }, // Should require signature
          },
          {
            id: '2',
            attributes: { name: 'Regular Team' }, // Should not require signature
          },
          {
            id: '3',
            attributes: { name: 'VHA 456 Release of Information' }, // Should require signature (Oracle Health)
          },
        ],
      };

      const store = mockStore();
      mockApiRequest(mockResponse);

      return store.dispatch(getAllTriageTeamRecipients()).then(() => {
        const actions = store.getActions();

        expect(
          actions[0].response.data[0].attributes.signatureRequired,
        ).to.equal(true);
        expect(actions[0].response.data[1].attributes.signatureRequired).to.be
          .undefined;
        expect(
          actions[0].response.data[2].attributes.signatureRequired,
        ).to.equal(true);
      });
    });
  });
});
