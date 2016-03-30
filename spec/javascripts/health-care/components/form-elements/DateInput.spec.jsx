import React from 'react';
import SkinDeep from 'skin-deep';

import DateInput from '../../../../../_health-care/_js/components/form-elements/DateInput';

describe('<DateInput>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    it('label must be a string', () => {
      SkinDeep.shallowRender(
        <DateInput label day={1} month={12} year={2010} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `label` of type `boolean` supplied to `DateInput`, expected `string`./);
    });

    it('day is required', () => {
      SkinDeep.shallowRender(
        <DateInput month={12} year={2010} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `day` was not specified in `DateInput`/);
    });

    it('day must be a number', () => {
      SkinDeep.shallowRender(
        <DateInput day month={12} year={2010} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `day` of type `boolean` supplied to `DateInput`, expected `number`./);
    });

    it('month is required', () => {
      SkinDeep.shallowRender(
        <DateInput day={1} year={2010} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `month` was not specified in `DateInput`/);
    });

    it('month must be a number', () => {
      SkinDeep.shallowRender(
        <DateInput day={1} month year={2010} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `month` of type `boolean` supplied to `DateInput`, expected `number`./);
    });

    it('year is required', () => {
      SkinDeep.shallowRender(
        <DateInput day={1} month={12} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `year` was not specified in `DateInput`/);
    });

    it('year must be a number', () => {
      SkinDeep.shallowRender(
        <DateInput day={1} month={12} year onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `year` of type `boolean` supplied to `DateInput`, expected `number`./);
    });

    it('onValueChange is required', () => {
      SkinDeep.shallowRender(
        <DateInput day={1} month={12} year={2010}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `DateInput`/);
    });

    it('onValueChange must be a func', () => {
      SkinDeep.shallowRender(
        <DateInput day={1} month={12} year onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `DateInput`, expected `function`/);
    });
  });

  it('has sane looking features', () => {
    const tree = SkinDeep.shallowRender(
      <DateInput day={1} month={12} year={2010} onValueChange={(_update) => {}}/>);
    expect(tree.everySubTree('ErrorableNumberInput')).to.have.lengthOf(1);
    expect(tree.everySubTree('ErrorableSelect')).to.have.lengthOf(2);
  });
});
