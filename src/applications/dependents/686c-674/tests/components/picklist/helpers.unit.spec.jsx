import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { createDoB } from '../../test-helpers';

import {
  getValue,
  SelectState,
  SelectCountry,
  PastDate,
} from '../../../components/picklist/helpers';

describe('picklist helpers', () => {
  describe('getValue', () => {
    it('should return the correct value for va-radio', () => {
      const event = {
        target: {
          name: 'removalReason',
          tagName: 'VA-RADIO',
        },
        detail: { value: 'marriageEnded' },
      };
      const result = getValue(event);
      expect(result).to.deep.equal({
        field: 'removalReason',
        value: 'marriageEnded',
      });
    });
    it('should return the correct value for va-select', () => {
      const event = {
        target: {
          name: 'state',
          tagName: 'VA-SELECT',
        },
        detail: { value: 'NY' },
      };
      const result = getValue(event);
      expect(result).to.deep.equal({ field: 'state', value: 'NY' });
    });
    it('should return the correct value for va-text-input', () => {
      const event = {
        target: { name: 'city', tagName: 'VA-TEXT-INPUT' },
        detail: { value: 'New York' },
      };
      const result = getValue(event);
      expect(result).to.deep.equal({ field: 'city', value: 'New York' });
    });
    it('should return the correct value for va-checkbox', () => {
      const event = {
        target: { name: 'outsideUS', tagName: 'VA-CHECKBOX' },
        detail: { checked: true },
      };
      const result = getValue(event);
      expect(result).to.deep.equal({ field: 'outsideUS', value: true });
    });
    it('should return the correct value for other elements', () => {
      const event = {
        target: { name: 'other', tagName: 'INPUT', value: 'test' },
      };
      const result = getValue(event);
      expect(result).to.deep.equal({ field: 'other', value: 'test' });
    });
  });

  describe('SelectState', () => {
    it('should render', () => {
      const { container } = render(
        <SelectState
          name="state"
          label="State"
          onChange={() => {}}
          value="NY"
        />,
      );
      const select = $('va-select', container);
      expect(select).to.exist;
      expect(select.getAttribute('name')).to.equal('state');
      expect(select.getAttribute('label')).to.equal('State');
      expect(select.getAttribute('value')).to.equal('NY');
      expect(select.getAttribute('required')).to.equal('true');
      const options = $$('option', select);
      // There are 59 options (50 states, DC, etc.)
      expect(options.length > 50).to.be.true;
    });
  });

  describe('SelectCountry', () => {
    it('should render select with all countries except USA', () => {
      const { container } = render(
        <SelectCountry
          name="country"
          label="Country"
          onChange={() => {}}
          value="ATG"
        />,
      );
      const select = $('va-select', container);
      expect(select).to.exist;
      expect(select.getAttribute('name')).to.equal('country');
      expect(select.getAttribute('label')).to.equal('Country');
      expect(select.getAttribute('value')).to.equal('ATG');
      expect(select.getAttribute('required')).to.equal('true');
      const options = $$('option', select);
      // There are 249 options (countries + empty option)
      expect(options.length > 200).to.be.true;
      // USA shouldn't be included
      expect(options.some(option => option.value === 'USA')).to.be.false;
    });
  });

  describe('PastDate', () => {
    const renderPastDate = (date = '', formSubmitted = false) =>
      render(
        <PastDate
          date={date}
          label="Some end date"
          formSubmitted={formSubmitted}
          missingErrorMessage="Date is required"
        />,
      );

    it('should render', () => {
      const { container } = renderPastDate('2020-01-01', false);

      const memorableDate = $('va-memorable-date', container);
      expect(memorableDate).to.exist;
      expect(memorableDate.getAttribute('name')).to.equal('endDate');
      expect(memorableDate.getAttribute('label')).to.equal('Some end date');
      expect(memorableDate.getAttribute('month-select')).to.equal('true');
      expect(memorableDate.getAttribute('required')).to.equal('true');
      expect(memorableDate.getAttribute('value')).to.equal('2020-01-01');
    });

    it('should not show error when form is not submitted and date is missing', () => {
      const { container } = renderPastDate('', false);

      const memorableDate = $('va-memorable-date', container);
      expect(memorableDate).to.exist;
      expect(memorableDate.getAttribute('error')).to.be.null;
    });

    it('should show error when form is submitted and date is missing', () => {
      const { container } = renderPastDate('', true);

      const memorableDate = $('va-memorable-date', container);
      expect(memorableDate).to.exist;
      expect(memorableDate.getAttribute('error')).to.equal('Date is required');
    });

    it('should show error when form is submitted and date is in the future', () => {
      // createDoB(-years, -months)
      const { container } = renderPastDate(createDoB(0, -2), true);

      const memorableDate = $('va-memorable-date', container);
      expect(memorableDate).to.exist;
      expect(memorableDate.getAttribute('error')).to.equal('Enter a past date');
    });
  });
});
