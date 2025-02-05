import { expect } from 'chai';
import {
  mockApiRequest,
  mockMultipleApiRequests,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';
import {
  updateReportRecordType,
  updateReportDateRange,
  genAndDownloadCCD,
} from '../../actions/downloads';
import { Actions } from '../../util/actionTypes';

describe('Download Actions', () => {
  describe('genAndDownloadCCD', () => {
    let clickToRestore = null;
    beforeEach(() => {
      clickToRestore = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = sinon.spy();
      window.URL = {
        createObjectURL: sinon.stub().returns('test'),
        revokeObjectURL: sinon.spy(),
      };
      window.location = { assign: sinon.spy() };
    });
    afterEach(() => {
      delete window.URL;
      delete window.location;
      HTMLAnchorElement.prototype.click = clickToRestore;
    });
    it('should dispatch an error on failed API calls', async () => {
      const dispatch = sinon.spy();
      const firstName = 'first';
      const lastName = 'last';
      mockApiRequest([{ status: 'ERROR', dateGenerated: 'date' }]);
      await genAndDownloadCCD(firstName, lastName)(dispatch);
      expect(dispatch.callCount).to.be.equal(2);
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Downloads.CCD_GENERATION_ERROR,
      );
      expect(dispatch.secondCall.args[0].response).to.equal('date');
    });

    it('should dispatch a download on successful API calls', async () => {
      const dispatch = sinon.spy();
      const firstName = 'first';
      const lastName = 'last';
      const dateGenerated = '2024-10-30T10:00:40.000-0400';
      const completeRequest = {
        shouldResolve: true,
        response: [{ status: 'COMPLETE', dateGenerated }],
      };
      const downLoadRequest = {
        shouldResolve: true,
        response: { text: sinon.stub().returns('xml') },
      };
      mockMultipleApiRequests([completeRequest, downLoadRequest]);
      await genAndDownloadCCD(firstName, lastName)(dispatch);
      expect(dispatch.callCount).to.be.equal(2);
      expect(dispatch.calledWith({ type: Actions.Downloads.GENERATE_CCD })).to
        .be.true;
    });
    it('should call itself recursively until we get a complete status', async () => {
      const dispatch = sinon.spy();
      const firstName = 'first';
      const lastName = 'last';
      const dateGenerated = '2024-10-30T10:00:40.000-0400';
      const inProcessRequest = {
        shouldResolve: true,
        response: [{ status: 'IN_PROCESS', dateGenerated }],
      };
      const completeRequest = {
        shouldResolve: true,
        response: [{ status: 'COMPLETE', dateGenerated }],
      };

      mockMultipleApiRequests([inProcessRequest, completeRequest]);
      await genAndDownloadCCD(firstName, lastName)(dispatch);
      waitFor(() => {
        expect(dispatch.callCount).to.be.equal(2);
        expect(dispatch.calledWith({ type: Actions.Downloads.GENERATE_CCD })).to
          .be.true;
        // expect dispatch to be called with a function
        expect(dispatch.secondCall.args[0]).to.be.a('function');
      });
    });
  });

  describe('updateReportDateRange', () => {
    it('should dispatch an action of type updateReportDateRange', () => {
      const dispatch = sinon.spy();
      const option = 'opt';
      const fromDate = 'from';
      const toDate = 'to';
      updateReportDateRange(option, fromDate, toDate)(dispatch);
      expect(dispatch.calledTwice).to.be.true;
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Downloads.SET_DATE_FILTER,
      );
      expect(dispatch.firstCall.args[0].response).to.deep.equal({
        option,
        fromDate,
        toDate,
      });
    });
  });

  describe('updateReportRecordType', () => {
    it('should dispatch an action of type updateReportRecordType', () => {
      const dispatch = sinon.spy();
      updateReportRecordType({ sample: 'test' })(dispatch);
      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Downloads.SET_RECORD_FILTER,
      );
      expect(dispatch.firstCall.args[0].response).to.deep.equal({
        sample: 'test',
      });
    });
  });
});
