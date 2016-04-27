import React from 'react';
import SkinDeep from 'skin-deep';

import FixedTable from '../../../../../_health-care/_js/components/form-elements/FixedTable';

describe('<FixedTable>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    /** Mock function used to verify propType checks for functions. */
    const func = () => {};

    it('component is required', () => {
      SkinDeep.shallowRender(
        <FixedTable rows={[]} onRowsUpdate={func}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `component` was not specified in `FixedTable`/);
    });

    it('component must be a func', () => {
      SkinDeep.shallowRender(
        <FixedTable rows={[]} component onRowsUpdate={func}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `component` of type `boolean` supplied to `FixedTable`, expected `function`/);
    });

    it('onRowsUpdate is required', () => {
      SkinDeep.shallowRender(
        <FixedTable rows={[]} component={func}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onRowsUpdate` was not specified in `FixedTable`/);
    });

    it('onRowsUpdate must be a func', () => {
      SkinDeep.shallowRender(
        <FixedTable rows={[]} component={func} onRowsUpdate/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onRowsUpdate` of type `boolean` supplied to `FixedTable`, expected `function`/);
    });

    xit('rows is required', () => {
      SkinDeep.shallowRender(
        <FixedTable component={func} onRowsUpdate={func}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `rows` was not specified in `FixedTable`/);
    });

    xit('rows must be an array', () => {
      SkinDeep.shallowRender(
        <FixedTable rows component={func} onRowsUpdate={func}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `rows` was not specified in `FixedTable`/);
    });
  });
});

