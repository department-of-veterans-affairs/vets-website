import { expect } from 'chai';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import { tooltipNames } from '../../util/constants';
import {
  getTooltips,
  createNewTooltip,
  incrementTooltip,
  updateTooltipVisibility,
  setTooltip,
  getTooltip,
} from '../../actions/tooltip';
import * as rxApi from '../../api/rxApi';

describe('Tooltip Actions', () => {
  let sandbox;
  let dispatch;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dispatch = sandbox.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getTooltips', () => {
    it('dispatches GET_TOOLTIPS on success', async () => {
      const mockResponse = [
        { id: 1, tooltipName: 'test_tooltip', hidden: false },
      ];
      sandbox.stub(rxApi, 'getTooltipsList').resolves(mockResponse);

      const result = await getTooltips()(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: Actions.Tooltip.GET_TOOLTIPS,
        response: mockResponse,
      });
      expect(result).to.deep.equal(mockResponse);
    });

    it('dispatches GET_TOOLTIPS_ERROR on failure', async () => {
      const error = new Error('API Error');
      sandbox.stub(rxApi, 'getTooltipsList').rejects(error);

      const result = await getTooltips()(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: Actions.Tooltip.GET_TOOLTIPS_ERROR,
      });
      expect(result).to.equal(error);
    });
  });

  describe('createNewTooltip', () => {
    it('dispatches CREATE_TOOLTIP on success', async () => {
      const mockResponse = {
        id: 1,
        tooltipName: tooltipNames.mhvMedicationsTooltipFilterAccordion,
        hidden: false,
      };
      sandbox.stub(rxApi, 'createTooltip').resolves(mockResponse);

      const result = await createNewTooltip()(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: Actions.Tooltip.CREATE_TOOLTIP,
        response: mockResponse,
      });
      expect(result).to.deep.equal(mockResponse);
    });

    it('dispatches CREATE_TOOLTIP_ERROR on failure', async () => {
      const error = new Error('API Error');
      sandbox.stub(rxApi, 'createTooltip').rejects(error);

      const result = await createNewTooltip()(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: Actions.Tooltip.CREATE_TOOLTIP_ERROR,
      });
      expect(result).to.equal(error);
    });
  });

  describe('incrementTooltip', () => {
    it('calls incrementTooltipCounter API on success', async () => {
      const tooltipId = 123;
      const stub = sandbox.stub(rxApi, 'incrementTooltipCounter').resolves();

      await incrementTooltip(tooltipId)(dispatch);

      expect(stub.calledOnce).to.be.true;
      expect(stub.calledWith(tooltipId)).to.be.true;
      expect(dispatch.called).to.be.false;
    });

    it('dispatches INCREMENT_TOOLTIP_COUNTER_ERROR on failure', async () => {
      const tooltipId = 123;
      const error = new Error('API Error');
      sandbox.stub(rxApi, 'incrementTooltipCounter').rejects(error);

      await incrementTooltip(tooltipId)(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: Actions.Tooltip.INCREMENT_TOOLTIP_COUNTER_ERROR,
        error,
      });
    });
  });

  describe('updateTooltipVisibility', () => {
    it('dispatches SET_TOOLTIP_VISIBILITY on success', async () => {
      const tooltipId = 123;
      const tooltipVisibility = false;
      sandbox.stub(rxApi, 'apiHideTooltip').resolves();

      await updateTooltipVisibility(tooltipId, tooltipVisibility)(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
        payload: tooltipVisibility,
      });
    });

    it('dispatches UPDATE_TOOLTIP_VISIBILITY_ERROR on failure', async () => {
      const tooltipId = 123;
      const tooltipVisibility = false;
      const error = new Error('API Error');
      sandbox.stub(rxApi, 'apiHideTooltip').rejects(error);

      await updateTooltipVisibility(tooltipId, tooltipVisibility)(dispatch);

      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: Actions.Tooltip.UPDATE_TOOLTIP_VISIBILITY_ERROR,
        error,
      });
    });
  });

  describe('setTooltip', () => {
    it('dispatches SET_TOOLTIP_ID and SET_TOOLTIP_VISIBILITY', () => {
      const tooltipId = 123;
      const tooltipVisibility = true;

      setTooltip(tooltipId, tooltipVisibility)(dispatch);

      expect(dispatch.calledTwice).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: Actions.Tooltip.SET_TOOLTIP_ID,
        payload: tooltipId,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
        payload: tooltipVisibility,
      });
    });
  });

  describe('getTooltip', () => {
    it('returns the matching tooltip when found', async () => {
      const mockTooltips = [
        { id: 1, tooltipName: 'other_tooltip', hidden: false },
        {
          id: 2,
          tooltipName: tooltipNames.mhvMedicationsTooltipFilterAccordion,
          hidden: false,
        },
      ];
      sandbox.stub(rxApi, 'getTooltipsList').resolves(mockTooltips);

      // getTooltip dispatches getTooltips internally, so we need a dispatch that returns the tooltips
      const mockDispatch = sandbox.stub();
      mockDispatch.callsFake(action => {
        if (typeof action === 'function') {
          return action(mockDispatch);
        }
        return action;
      });

      const result = await getTooltip()(mockDispatch);

      expect(result).to.deep.equal({
        id: 2,
        tooltipName: tooltipNames.mhvMedicationsTooltipFilterAccordion,
        hidden: false,
      });
    });

    it('returns undefined when no matching tooltip is found', async () => {
      const mockTooltips = [
        { id: 1, tooltipName: 'other_tooltip', hidden: false },
      ];
      sandbox.stub(rxApi, 'getTooltipsList').resolves(mockTooltips);

      const mockDispatch = sandbox.stub();
      mockDispatch.callsFake(action => {
        if (typeof action === 'function') {
          return action(mockDispatch);
        }
        return action;
      });

      const result = await getTooltip()(mockDispatch);

      expect(result).to.be.undefined;
    });

    it('dispatches GET_TOOLTIP_ERROR on failure', async () => {
      const error = new Error('API Error');
      sandbox.stub(rxApi, 'getTooltipsList').rejects(error);

      const mockDispatch = sandbox.stub();
      mockDispatch.callsFake(action => {
        if (typeof action === 'function') {
          return action(mockDispatch);
        }
        return action;
      });

      const result = await getTooltip()(mockDispatch);

      expect(result).to.be.an.instanceof(Error);
      expect(
        mockDispatch.calledWith({
          type: Actions.Tooltip.GET_TOOLTIP_ERROR,
          error: result,
        }),
      ).to.be.true;
    });

    it('handles empty tooltips array', async () => {
      sandbox.stub(rxApi, 'getTooltipsList').resolves([]);

      const mockDispatch = sandbox.stub();
      mockDispatch.callsFake(action => {
        if (typeof action === 'function') {
          return action(mockDispatch);
        }
        return action;
      });

      const result = await getTooltip()(mockDispatch);

      expect(result).to.be.undefined;
    });

    it('handles null response from getTooltips', async () => {
      sandbox.stub(rxApi, 'getTooltipsList').resolves(null);

      const mockDispatch = sandbox.stub();
      mockDispatch.callsFake(action => {
        if (typeof action === 'function') {
          return action(mockDispatch);
        }
        return action;
      });

      const result = await getTooltip()(mockDispatch);

      expect(result).to.be.undefined;
    });
  });
});
