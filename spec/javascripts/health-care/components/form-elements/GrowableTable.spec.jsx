import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';

import GrowableTable from '../../../../../_health-care/_js/components/form-elements/GrowableTable';

class Row extends React.Component {
  render() {
    return (
      <div/>
    );
  }
}

describe('<GrowableTable>', () => {
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
        <GrowableTable createRow={func} data={{}} initializeCurrentElement={func} onRowsUpdate={func} path="" rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `component` was not specified in `GrowableTable`/);
    });

    it('component must be a func', () => {
      SkinDeep.shallowRender(
        <GrowableTable component createRow={func} data={{}} initializeCurrentElement={func} onRowsUpdate={func} path="" rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `component` of type `boolean` supplied to `GrowableTable`, expected `function`/);
    });

    it('createRow is required', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} data={{}} initializeCurrentElement={func} onRowsUpdate={func} path="" rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `createRow` was not specified in `GrowableTable`/);
    });

    it('createRow must be a func', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} createRow data={{}} initializeCurrentElement={func} onRowsUpdate={func} path="" rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `createRow` of type `boolean` supplied to `GrowableTable`, expected `function`/);
    });

    it('data is required', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} createRow={func} initializeCurrentElement={func} onRowsUpdate={func} path="" rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `data` was not specified in `GrowableTable`/);
    });

    it('data must be an object', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} createRow={func} data initializeCurrentElement={func} onRowsUpdate={func} path="" rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `data` of type `boolean` supplied to `GrowableTable`, expected `object`/);
    });

    it('initializeCurrentElement is required', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} createRow={func} data={{}} onRowsUpdate={func} path="" rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `initializeCurrentElement` was not specified in `GrowableTable`/);
    });

    it('initializeCurrentElement must be a func', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} createRow={func} data={{}} initializeCurrentElement onRowsUpdate={func} path="" rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `initializeCurrentElement` of type `boolean` supplied to `GrowableTable`, expected `function`/);
    });

    it('onRowsUpdate is required', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} createRow={func} data={{}} initializeCurrentElement={func} path="" rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onRowsUpdate` was not specified in `GrowableTable`/);
    });

    it('onRowsUpdate must be a func', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} createRow={func} data={{}} initializeCurrentElement={func} onRowsUpdate path="" rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onRowsUpdate` of type `boolean` supplied to `GrowableTable`, expected `function`/);
    });

    it('path is required', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} createRow={func} data={{}} initializeCurrentElement={func} onRowsUpdate={func} rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `path` was not specified in `GrowableTable`/);
    });

    it('path must be an object', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} createRow={func} data={{}} initializeCurrentElement={func} onRowsUpdate={func} path rows={[]}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `path` of type `boolean` supplied to `GrowableTable`, expected `string`/);
    });

    xit('rows is required', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} createRow={func} data={{}} initializeCurrentElement={func} onRowsUpdate={func} path=""/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `rows` was not specified in `GrowableTable`/);
    });

    xit('rows must be an array', () => {
      SkinDeep.shallowRender(
        <GrowableTable component={func} createRow={func} data={{}} initializeCurrentElement={func} onRowsUpdate={func} path="" rows/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `rows` of type `boolean` supplied to `GrowableTable`, expected `array`/);
    });
  });

  describe('row management', () => {
    let growableTable;
    const rows = [
      { key: 'k1', value: 'a' },
      { key: 'k2', value: 'b' }
    ];
    const onRowsUpdate = sinon.spy();
    const initializeCurrentElement = sinon.spy();

    // Function that generates a new model for a row. Use numbers instead of letters to ensure
    // it never collides with the initial static row model objects in `rows`.
    let currentId = 0;
    const createRow = () => { return { value: currentId++ }; };

    before(() => {
      // It's perfectly fine in this test to reuse the rendered component. Do that
      // cause it cuts the test time from 1s down to ~0.1s.
      growableTable = ReactTestUtils.renderIntoDocument(
        <GrowableTable
            component={Row}
            createRow={createRow}
            initializeCurrentElement={initializeCurrentElement}
            rows={rows}
            onRowsUpdate={onRowsUpdate}
            path=""/>
      );
    });

    afterEach(() => {
      onRowsUpdate.reset();
    });

    it('Add Button adds new row w/o distubing existing entries', () => {
      const buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(growableTable, 'button');
      const addButton = buttons.find((element) => { return element.textContent === 'Add'; });
      expect(addButton).to.not.be.undefined;
      ReactTestUtils.Simulate.click(addButton);
      sinon.assert.calledOnce(onRowsUpdate);

      // Ensure original rows are untouched.
      const update = onRowsUpdate.firstCall.args[0];
      expect(update).to.have.length(rows.length + 1);
      expect(rows).to.eql(update.slice(0, rows.length));

      // Ensure new item has the key element and uses the createRow function.
      const newItem = update[rows.length];
      expect(newItem).to.have.property('key');
      expect(newItem).to.have.property('value').and.equal(currentId - 1);

      // Ensure second row update has different key.
      ReactTestUtils.Simulate.click(addButton);
      sinon.assert.calledTwice(onRowsUpdate);
      const newItem2 = onRowsUpdate.secondCall.args[0][rows.length];
      expect(newItem2).to.have.property('value').and.equal(currentId - 1).and.not.eql(newItem.value);
      expect(newItem2).to.have.property('key').and.to.not.eql(newItem.key);
    });

    it('Remove Button removes its associated row', () => {
      const buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(growableTable, 'button');
      const removeButtons = buttons.filter((element) => { return element.textContent === 'Remove'; });
      expect(removeButtons).to.have.length(2);

      // Trigger the first remove should leave only the second element.
      ReactTestUtils.Simulate.click(removeButtons[0]);
      sinon.assert.calledOnce(onRowsUpdate);
      let update = onRowsUpdate.firstCall.args[0];
      expect(update).to.have.length(1);
      expect(update).to.eql(rows.slice(1, rows.length));

      // Trigger the second remove should leave only the second element.
      ReactTestUtils.Simulate.click(removeButtons[1]);
      sinon.assert.calledTwice(onRowsUpdate);
      update = onRowsUpdate.secondCall.args[0];
      expect(update).to.have.length(1);
      expect(update).to.eql(rows.slice(0, 1));
    });

    it('Data propagates to component', () => {
      const renderedComponents = ReactTestUtils.scryRenderedComponentsWithType(growableTable, Row);
      expect(renderedComponents).to.have.length(2);
      expect(renderedComponents[0].props.data).to.eql(rows[0]);
      expect(renderedComponents[1].props.data).to.eql(rows[1]);

      // Triggering the onValueChange function only updates the corresponding array entry.
      const fieldUpdate = { value: 'new-value' };
      renderedComponents[0].props.onValueChange('value', fieldUpdate.value);
      sinon.assert.calledOnce(onRowsUpdate);
      let update = onRowsUpdate.firstCall.args[0];
      expect(update).to.have.length(rows.length);
      expect(Object.assign({}, rows[0], fieldUpdate)).to.eql(update[0]);
      expect(rows[1]).to.eql(update[1]);

      // Ensure the second data object doesn't affect the first.
      renderedComponents[1].props.onValueChange('value', fieldUpdate.value);
      sinon.assert.calledTwice(onRowsUpdate);
      update = onRowsUpdate.secondCall.args[0];
      expect(update).to.have.length(rows.length);
      expect(rows[0]).to.eql(update[0]);
      expect(Object.assign({}, rows[1], fieldUpdate)).to.eql(update[1]);
    });
  });
});

