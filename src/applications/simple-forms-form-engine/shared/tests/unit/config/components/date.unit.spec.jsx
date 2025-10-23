import { expect } from 'chai';
import date from 'applications/simple-forms-form-engine/shared/config/components/date';
import * as datePatterns from 'platform/forms-system/src/js/web-component-patterns/datePatterns';
import sinon from 'sinon';

describe('date', () => {
  const component = {
    hint:
      'This date component includes the day as well as the month and the year.',
    id: '172748',
    label: 'Date with Day',
    required: true,
    type: 'digital_form_date_component',
    dateFormat: 'month_day_year',
  };

  it('is a tuple', () => {
    const schemas = date(component);
    expect(schemas.length).to.eq(2);
  });

  context('when date format is month_day_year', () => {
    beforeEach(() => {
      sinon.spy(datePatterns, 'currentOrPastDateUI');
    });

    afterEach(() => {
      datePatterns.currentOrPastDateUI.restore();
    });

    it('matches the correct schema', () => {
      const [schema] = date(component);
      expect(schema).to.deep.equal(datePatterns.currentOrPastDateSchema);
    });

    it('calls the correct UI function', () => {
      date(component);

      expect(
        datePatterns.currentOrPastDateUI.calledWithMatch({
          title: component.label,
          hint: component.hint,
        }),
      ).to.eq(true);
    });
  });

  context('when date format is month_year', () => {
    beforeEach(() => {
      sinon.spy(datePatterns, 'currentOrPastMonthYearDateUI');

      component.dateFormat = 'month_year';
      component.label = 'Date with only month and year';
      component.hint =
        'This date component does not include a field for the day.';
    });

    afterEach(() => {
      datePatterns.currentOrPastMonthYearDateUI.restore();
    });

    it('matches the correct schema', () => {
      const [schema] = date(component);
      expect(schema).to.deep.equal(
        datePatterns.currentOrPastMonthYearDateSchema,
      );
    });

    it('calls the correct UI function', () => {
      date(component);

      expect(
        datePatterns.currentOrPastMonthYearDateUI.calledWithMatch({
          title: component.label,
          hint: component.hint,
        }),
      ).to.eq(true);
    });
  });
});
