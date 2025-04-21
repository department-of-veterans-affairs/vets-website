import { expect } from 'chai';
import * as api from 'platform/forms/save-in-progress/api';
import * as recordEventModule from 'platform/monitoring/record-event';
import { REMOVING_SAVED_FORM_SUCCESS } from 'platform/user/profile/actions';
import sinon from 'sinon';

import {
  CLEAR_FORM_DATA,
  CLOSE_REVIEW_CHAPTER,
  OPEN_REVIEW_CHAPTER,
  SET_CATEGORY_ID,
  SET_LOCATION_SEARCH,
  SET_SUBTOPIC_ID,
  SET_TOPIC_ID,
  SET_UPDATED_IN_REVIEW,
  SET_VA_HEALTH_FACILITY,
  clearFormData,
  closeReviewChapter,
  openReviewChapter,
  removeAskVaForm,
  setCategoryID,
  setLocationInput,
  setSubtopicID,
  setTopicID,
  setUpdatedInReview,
  setVAHealthFacility,
} from '../../actions/index';

describe('Action Creators', () => {
  describe('Synchronous Actions', () => {
    it('should create an action to set the category ID', () => {
      const id = '123';
      const expectedAction = {
        type: SET_CATEGORY_ID,
        payload: id,
      };
      expect(setCategoryID(id)).to.deep.equal(expectedAction);
    });

    it('should create an action to set the topic ID', () => {
      const id = '456';
      const expectedAction = {
        type: SET_TOPIC_ID,
        payload: id,
      };
      expect(setTopicID(id)).to.deep.equal(expectedAction);
    });

    it('should create an action to set the subtopic ID', () => {
      const id = '789';
      const expectedAction = {
        type: SET_SUBTOPIC_ID,
        payload: id,
      };
      expect(setSubtopicID(id)).to.deep.equal(expectedAction);
    });

    it('should create an action to set updated in review', () => {
      const page = 'some-page';
      const expectedAction = {
        type: SET_UPDATED_IN_REVIEW,
        payload: page,
      };
      expect(setUpdatedInReview(page)).to.deep.equal(expectedAction);
    });

    it('should create an action to close a review chapter', () => {
      const closedChapter = 'chapter-1';
      const pageKeys = ['page-1', 'page-2'];
      const expectedAction = {
        type: CLOSE_REVIEW_CHAPTER,
        closedChapter,
        pageKeys,
      };
      expect(closeReviewChapter(closedChapter, pageKeys)).to.deep.equal(
        expectedAction,
      );
    });

    it('should create an action to close a review chapter with default pageKeys', () => {
      const closedChapter = 'chapter-1';
      const expectedAction = {
        type: CLOSE_REVIEW_CHAPTER,
        closedChapter,
        pageKeys: [],
      };
      expect(closeReviewChapter(closedChapter)).to.deep.equal(expectedAction);
    });

    it('should create an action to open a review chapter', () => {
      const openedChapter = 'chapter-2';
      const expectedAction = {
        type: OPEN_REVIEW_CHAPTER,
        openedChapter,
      };
      expect(openReviewChapter(openedChapter)).to.deep.equal(expectedAction);
    });

    it('should create an action to set the location search input', () => {
      const searchInput = 'New York';
      const expectedAction = {
        type: SET_LOCATION_SEARCH,
        payload: searchInput,
      };
      expect(setLocationInput(searchInput)).to.deep.equal(expectedAction);
    });

    it('should create an action to set the VA health facility', () => {
      const name = 'VA Medical Center';
      const expectedAction = {
        type: SET_VA_HEALTH_FACILITY,
        payload: name,
      };
      expect(setVAHealthFacility(name)).to.deep.equal(expectedAction);
    });

    it('should create an action to clear form data', () => {
      const expectedAction = {
        type: CLEAR_FORM_DATA,
      };
      expect(clearFormData()).to.deep.equal(expectedAction);
    });
  });

  describe('Asynchronous Actions', () => {
    let sandbox;
    let dispatch;
    let recordEventStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      dispatch = sandbox.spy();
      recordEventStub = sinon.stub(recordEventModule, 'default');
    });

    afterEach(() => {
      recordEventStub.restore();
      sandbox.restore();
    });

    describe('removeAskVaForm', () => {
      it('should handle successful form removal', async () => {
        const formId = '123';
        const removeFormStub = sandbox.stub(api, 'removeFormApi').resolves();

        await removeAskVaForm(formId)(dispatch);

        expect(removeFormStub.calledWith(formId)).to.be.true;
        expect(recordEventStub.called).to.be.true;
        expect(recordEventStub.getCall(0).args[0]).to.deep.equal({
          event: 'sip-form-delete-success',
        });
        expect(
          dispatch.calledWith({
            type: REMOVING_SAVED_FORM_SUCCESS,
            formId,
          }),
        ).to.be.true;
      });

      it('should handle form removal failure', async () => {
        const formId = '123';
        const error = new Error('Failed to remove form');
        const removeFormStub = sandbox
          .stub(api, 'removeFormApi')
          .rejects(error);

        await removeAskVaForm(formId)(dispatch);

        expect(removeFormStub.calledWith(formId)).to.be.true;
        expect(recordEventStub.called).to.be.true;
        expect(recordEventStub.getCall(0).args[0]).to.deep.equal({
          event: 'sip-form-delete-failed',
          error: error.message,
        });
        expect(dispatch.called).to.be.false;
      });

      it('should handle form removal failure with undefined error', async () => {
        const formId = '123';
        const removeFormStub = sandbox.stub(api, 'removeFormApi').rejects();

        await removeAskVaForm(formId)(dispatch);

        expect(removeFormStub.calledWith(formId)).to.be.true;
        expect(recordEventStub.called).to.be.true;
        expect(recordEventStub.getCall(0).args[0]).to.deep.equal({
          event: 'sip-form-delete-failed',
          error: 'Error',
        });
        expect(dispatch.called).to.be.false;
      });
    });
  });
});
