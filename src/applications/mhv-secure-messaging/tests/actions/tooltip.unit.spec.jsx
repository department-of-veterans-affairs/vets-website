import { expect } from 'chai';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import {
  getTooltips,
  createNewTooltip,
  incrementTooltip,
  updateTooltipVisibility,
  setTooltip,
  getTooltipByName,
} from '../../actions/tooltip';
import * as SmApi from '../../api/SmApi';

describe('tooltip actions', () => {
  let sandbox;
  let dispatch;
  let dispatchedActions;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dispatchedActions = [];
    dispatch = action => {
      if (typeof action === 'function') {
        return action(dispatch);
      }
      dispatchedActions.push(action);
      return action;
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getTooltips', () => {
    it('dispatches GET_TOOLTIPS on success', async () => {
      const mockResponse = [
        { id: '1', tooltipName: 'test_tooltip', hidden: false },
      ];
      sandbox.stub(SmApi, 'getTooltipsList').resolves(mockResponse);

      const result = await getTooltips()(dispatch);

      expect(result).to.deep.equal(mockResponse);
      expect(dispatchedActions).to.have.lengthOf(1);
      expect(dispatchedActions[0].type).to.equal(Actions.Tooltip.GET_TOOLTIPS);
      expect(dispatchedActions[0].response).to.deep.equal(mockResponse);
    });

    it('dispatches GET_TOOLTIPS_ERROR on failure', async () => {
      const error = new Error('API failed');
      sandbox.stub(SmApi, 'getTooltipsList').rejects(error);

      const result = await getTooltips()(dispatch);

      expect(result).to.be.an.instanceOf(Error);
      expect(dispatchedActions).to.have.lengthOf(1);
      expect(dispatchedActions[0].type).to.equal(
        Actions.Tooltip.GET_TOOLTIPS_ERROR,
      );
    });
  });

  describe('createNewTooltip', () => {
    it('dispatches CREATE_TOOLTIP on success', async () => {
      const mockResponse = {
        id: 'new-id',
        tooltipName: 'sm_test',
        hidden: false,
        counter: 1,
      };
      sandbox.stub(SmApi, 'createTooltip').resolves(mockResponse);

      const result = await createNewTooltip('sm_test')(dispatch);

      expect(result).to.deep.equal(mockResponse);
      expect(dispatchedActions).to.have.lengthOf(1);
      expect(dispatchedActions[0].type).to.equal(
        Actions.Tooltip.CREATE_TOOLTIP,
      );
      expect(dispatchedActions[0].response).to.deep.equal(mockResponse);
    });

    it('dispatches CREATE_TOOLTIP_ERROR on failure', async () => {
      sandbox.stub(SmApi, 'createTooltip').rejects(new Error('create failed'));

      const result = await createNewTooltip('sm_test')(dispatch);

      expect(result).to.be.an.instanceOf(Error);
      expect(dispatchedActions).to.have.lengthOf(1);
      expect(dispatchedActions[0].type).to.equal(
        Actions.Tooltip.CREATE_TOOLTIP_ERROR,
      );
    });
  });

  describe('incrementTooltip', () => {
    it('calls incrementTooltipCounter API', async () => {
      sandbox.stub(SmApi, 'incrementTooltipCounter').resolves({});

      await incrementTooltip('tooltip-123')(dispatch);

      expect(dispatchedActions).to.have.lengthOf(0);
    });

    it('dispatches INCREMENT_TOOLTIP_COUNTER_ERROR on failure', async () => {
      const error = new Error('increment failed');
      sandbox.stub(SmApi, 'incrementTooltipCounter').rejects(error);

      await incrementTooltip('tooltip-123')(dispatch);

      expect(dispatchedActions).to.have.lengthOf(1);
      expect(dispatchedActions[0].type).to.equal(
        Actions.Tooltip.INCREMENT_TOOLTIP_COUNTER_ERROR,
      );
      expect(dispatchedActions[0].error).to.equal(error);
    });
  });

  describe('updateTooltipVisibility', () => {
    it('hides tooltip and dispatches SET_TOOLTIP_VISIBILITY', async () => {
      sandbox.stub(SmApi, 'hideTooltip').resolves({});

      await updateTooltipVisibility('tooltip-123', false)(dispatch);

      expect(dispatchedActions).to.have.lengthOf(1);
      expect(dispatchedActions[0].type).to.equal(
        Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
      );
      expect(dispatchedActions[0].payload).to.be.false;
    });

    it('dispatches UPDATE_TOOLTIP_VISIBILITY_ERROR on failure', async () => {
      const error = new Error('hide failed');
      sandbox.stub(SmApi, 'hideTooltip').rejects(error);

      await updateTooltipVisibility('tooltip-123', false)(dispatch);

      expect(dispatchedActions).to.have.lengthOf(1);
      expect(dispatchedActions[0].type).to.equal(
        Actions.Tooltip.UPDATE_TOOLTIP_VISIBILITY_ERROR,
      );
      expect(dispatchedActions[0].error).to.equal(error);
    });
  });

  describe('setTooltip', () => {
    it('dispatches SET_TOOLTIP_ID and SET_TOOLTIP_VISIBILITY', () => {
      setTooltip('tooltip-456', true)(dispatch);

      expect(dispatchedActions).to.have.lengthOf(2);
      expect(dispatchedActions[0]).to.deep.equal({
        type: Actions.Tooltip.SET_TOOLTIP_ID,
        payload: 'tooltip-456',
      });
      expect(dispatchedActions[1]).to.deep.equal({
        type: Actions.Tooltip.SET_TOOLTIP_VISIBILITY,
        payload: true,
      });
    });
  });

  describe('getTooltipByName', () => {
    it('returns matching tooltip when found', async () => {
      const tooltips = [
        { id: '1', tooltipName: 'other_tooltip', hidden: false },
        { id: '2', tooltipName: 'sm_target', hidden: false },
      ];
      sandbox.stub(SmApi, 'getTooltipsList').resolves(tooltips);

      const result = await getTooltipByName('sm_target')(dispatch);

      expect(result).to.deep.equal(tooltips[1]);
    });

    it('returns undefined when no match found', async () => {
      sandbox
        .stub(SmApi, 'getTooltipsList')
        .resolves([{ id: '1', tooltipName: 'other_tooltip' }]);

      const result = await getTooltipByName('nonexistent')(dispatch);

      expect(result).to.be.undefined;
    });

    it('returns undefined on API error', async () => {
      sandbox.stub(SmApi, 'getTooltipsList').rejects(new Error('failed'));

      const result = await getTooltipByName('sm_target')(dispatch);

      expect(result).to.be.undefined;
    });
  });
});
