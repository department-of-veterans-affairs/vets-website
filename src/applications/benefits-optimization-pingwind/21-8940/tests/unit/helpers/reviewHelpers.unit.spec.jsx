import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import {
  wrapDateUiWithDl,
  wrapDateRangeUiWithDl,
} from '../../../helpers/reviewHelpers';

describe('21-8940 reviewHelpers', () => {
  describe('wrapDateUiWithDl', () => {
    it('should return undefined when uiSchema is falsy', () => {
      expect(wrapDateUiWithDl(null)).to.be.null;
      expect(wrapDateUiWithDl(undefined)).to.be.undefined;
    });

    it('should wrap date UI with dl and add useDlWrap option', () => {
      const uiSchema = {
        'ui:title': 'Test Date',
        'ui:options': {
          monthYearOnly: true,
        },
      };

      const result = wrapDateUiWithDl(uiSchema);

      expect(result['ui:options'].useDlWrap).to.be.true;
      expect(result['ui:options'].customTitle).to.equal(' ');
      expect(result['ui:reviewWidget']).to.exist;
      expect(result['ui:reviewField']).to.be.undefined;
    });

    it('should preserve existing customTitle if provided', () => {
      const uiSchema = {
        'ui:title': 'Test Date',
        'ui:options': {
          customTitle: 'Custom Title',
        },
      };

      const result = wrapDateUiWithDl(uiSchema);

      expect(result['ui:options'].customTitle).to.equal('Custom Title');
    });

    it('should create a DateReviewWidget that formats dates correctly', () => {
      const uiSchema = {
        'ui:title': 'Test Date',
        'ui:options': {},
      };

      const result = wrapDateUiWithDl(uiSchema);
      const DateReviewWidget = result['ui:reviewWidget'];

      const wrapper = shallow(<DateReviewWidget value="2023-05-15" />);
      expect(wrapper.text()).to.include('May');
      expect(wrapper.text()).to.include('15');
      expect(wrapper.text()).to.include('2023');
      wrapper.unmount();
    });

    it('should create a DateReviewWidget for month/year only dates', () => {
      const uiSchema = {
        'ui:title': 'Test Date',
        'ui:options': {
          monthYearOnly: true,
        },
      };

      const result = wrapDateUiWithDl(uiSchema);
      const DateReviewWidget = result['ui:reviewWidget'];

      const wrapper = shallow(<DateReviewWidget value="2023-05-15" />);
      expect(wrapper.text()).to.include('May');
      expect(wrapper.text()).to.include('2023');
      expect(wrapper.text()).to.not.include('15');
      wrapper.unmount();
    });

    it('should apply dataDogHidden class when specified', () => {
      const uiSchema = {
        'ui:title': 'Test Date',
        'ui:options': {
          dataDogHidden: true,
        },
      };

      const result = wrapDateUiWithDl(uiSchema);
      const DateReviewWidget = result['ui:reviewWidget'];

      const wrapper = shallow(<DateReviewWidget value="2023-05-15" />);
      expect(wrapper.find('.dd-privacy-hidden')).to.have.lengthOf(1);
      expect(wrapper.prop('data-dd-action-name')).to.equal('Test Date');
      wrapper.unmount();
    });

    it('should return null when date value is falsy', () => {
      const uiSchema = {
        'ui:title': 'Test Date',
        'ui:options': {},
      };

      const result = wrapDateUiWithDl(uiSchema);
      const DateReviewWidget = result['ui:reviewWidget'];

      const wrapper = shallow(<DateReviewWidget value={null} />);
      expect(wrapper.type()).to.be.null;
      wrapper.unmount();
    });

    it('should handle invalid date values gracefully', () => {
      const uiSchema = {
        'ui:title': 'Test Date',
        'ui:options': {},
      };

      const result = wrapDateUiWithDl(uiSchema);
      const DateReviewWidget = result['ui:reviewWidget'];

      const wrapper = shallow(<DateReviewWidget value="invalid-date" />);
      // Should still render the invalid value - browser returns 'Invalid Date'
      expect(wrapper.text()).to.include('Invalid Date');
      wrapper.unmount();
    });
  });

  describe('wrapDateRangeUiWithDl', () => {
    it('should return undefined when dateRangeUi is falsy', () => {
      expect(wrapDateRangeUiWithDl(null)).to.be.null;
      expect(wrapDateRangeUiWithDl(undefined)).to.be.undefined;
    });

    it('should wrap both from and to date fields', () => {
      const dateRangeUi = {
        from: {
          'ui:title': 'From Date',
          'ui:options': {},
        },
        to: {
          'ui:title': 'To Date',
          'ui:options': {},
        },
      };

      const result = wrapDateRangeUiWithDl(dateRangeUi);

      expect(result.from['ui:options'].useDlWrap).to.be.true;
      expect(result.to['ui:options'].useDlWrap).to.be.true;
      expect(result.from['ui:reviewWidget']).to.exist;
      expect(result.to['ui:reviewWidget']).to.exist;
    });

    it('should preserve other properties in dateRangeUi', () => {
      const dateRangeUi = {
        from: {
          'ui:title': 'From Date',
          'ui:options': {},
        },
        to: {
          'ui:title': 'To Date',
          'ui:options': {},
        },
        someOtherProperty: 'value',
      };

      const result = wrapDateRangeUiWithDl(dateRangeUi);

      expect(result.someOtherProperty).to.equal('value');
    });
  });
});
