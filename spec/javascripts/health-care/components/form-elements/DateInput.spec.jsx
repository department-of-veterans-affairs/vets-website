import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
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

  describe('error css', () => {
    it('no error styles when date is valid', () => {
      // Smarch is not a real month.
      const tree = SkinDeep.shallowRender(
        <DateInput day="1" month="12" year="2010" onValueChange={(_update) => {}}/>);
      expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(0);
      expect(tree.everySubTree('.usa-input-error-label')).to.have.lengthOf(0);
    });

    it('has error styles when date is invalid', () => {
      const tree = SkinDeep.shallowRender(
        <DateInput day="1" month="13" year="2010" onValueChange={(_update) => {}}/>);
      expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(1);
      expect(tree.everySubTree('.usa-input-error-label')).to.have.lengthOf(3);
    });
  });

  describe('ensure value changes propagate', () => {
    it('day changes', () => {
      let dateInput;

      const updatePromise = new Promise((resolve, _reject) => {
        dateInput = ReactTestUtils.renderIntoDocument(
          <DateInput
              day={1}
              month={2}
              year={2010}
              onValueChange={(update) => { resolve(update); }}/>
        );
      });

      dateInput._day.value = 3;
      ReactTestUtils.Simulate.change(dateInput._day);

      return expect(updatePromise).to.eventually.eql({ day: 3, month: 2, year: 2010 });
    });

    it('month changes', () => {
      let dateInput;

      const updatePromise = new Promise((resolve, _reject) => {
        dateInput = ReactTestUtils.renderIntoDocument(
          <DateInput
              day={1}
              month={2}
              year={2010}
              onValueChange={(update) => { resolve(update); }}/>
        );
      });

      dateInput._month.value = 3;
      ReactTestUtils.Simulate.change(dateInput._month);

      return expect(updatePromise).to.eventually.eql({ day: 1, month: 3, year: 2010 });
    });

    it('year changes', () => {
      let dateInput;

      const updatePromise = new Promise((resolve, _reject) => {
        dateInput = ReactTestUtils.renderIntoDocument(
          <DateInput
              day={1}
              month={2}
              year={2010}
              onValueChange={(update) => { resolve(update); }}/>
        );
      });

      dateInput._year.value = 1900;
      ReactTestUtils.Simulate.change(dateInput._year);

      return expect(updatePromise).to.eventually.eql({ day: 1, month: 2, year: 1900 });
    });
  });

  it('has sane looking features', () => {
    const tree = SkinDeep.shallowRender(
      <DateInput day={1} month={12} year={2010} onValueChange={(_update) => {}}/>);
    expect(tree.everySubTree('input')).to.have.lengthOf(3);
  });
});
