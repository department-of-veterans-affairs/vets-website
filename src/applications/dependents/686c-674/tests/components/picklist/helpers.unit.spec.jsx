import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  getValue,
  SelectState,
  SelectCountry,
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
      const select = container.querySelector('va-select');
      expect(select).to.exist;
      expect(select.getAttribute('name')).to.equal('state');
      expect(select.getAttribute('label')).to.equal('State');
      expect(select.getAttribute('value')).to.equal('NY');
      expect(select.getAttribute('required')).to.equal('true');
      const options = select.querySelectorAll('option');
      // There are 59 options (50 states, DC, etc.)
      expect(options.length > 50).to.be.true;
    });
  });

  describe('SelectCountry', () => {
    it('should render', () => {
      const { container } = render(
        <SelectCountry
          name="country"
          label="Country"
          onChange={() => {}}
          value="US"
        />,
      );
      const select = container.querySelector('va-select');
      expect(select).to.exist;
      expect(select.getAttribute('name')).to.equal('country');
      expect(select.getAttribute('label')).to.equal('Country');
      expect(select.getAttribute('value')).to.equal('US');
      expect(select.getAttribute('required')).to.equal('true');
      const options = select.querySelectorAll('option');
      // There are 249 options (countries + empty option)
      expect(options.length > 200).to.be.true;
    });
  });
});
