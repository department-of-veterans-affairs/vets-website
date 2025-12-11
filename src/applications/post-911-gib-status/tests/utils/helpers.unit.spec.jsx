import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import {
  formatPercent,
  formatVAFileNumber,
  formatMonthDayFields,
  benefitEndDateExplanation,
  notQualifiedWarning,
  genericErrorMessage,
} from '../../utils/helpers';

describe('helpers', () => {
  it('should return valid formatted percentage', () => {
    expect(formatPercent(75)).to.equal('75%');
    expect(formatPercent('100')).to.equal('100%');
    expect(formatPercent(undefined)).to.be.undefined;
  });

  it('should mask VA file number correctly', () => {
    expect(formatVAFileNumber('123456789')).to.equal('xxxxx-6789');
    expect(formatVAFileNumber(null)).to.equal('-');
    expect(formatVAFileNumber('')).to.equal('-');
  });

  it('should format month and day fields', () => {
    const field = { months: 2, days: 5 };
    expect(formatMonthDayFields(field)).to.equal('2 months, 5 days');
    expect(
      formatMonthDayFields({
        months: 1,
        days: 1,
      }),
    ).to.equal('1 month, 1 day');
    expect(formatMonthDayFields(null)).to.equal('unavailable');
    expect(formatMonthDayFields(undefined)).to.equal('unavailable');
  });

  it('should return the correct explanation for benefit end date', () => {
    const delimitingDate = '2024-12-31';
    expect(benefitEndDateExplanation('remainingEntitlement', delimitingDate))
      .not.to.be.undefined;
    expect(benefitEndDateExplanation('activeDuty')).not.to.be.undefined;
    expect(benefitEndDateExplanation('unknown')).to.be.undefined;
  });

  it('should return correct explanation for active duty', () => {
    const wrapper = shallow(benefitEndDateExplanation('activeDuty'));
    expect(wrapper.find('h3').text()).to.equal('Benefit end date');
    expect(
      wrapper
        .find('div')
        .at(1)
        .text(),
    ).to.equal(
      'Since you’re on active duty, your benefits don’t yet have an expiration date.',
    );
    wrapper.unmount();
  });

  it('should return correct explanation for remaining entitlement with an invalid date', () => {
    const invalidDate = 'invalid-date';

    const wrapper = shallow(
      benefitEndDateExplanation('remainingEntitlement', invalidDate),
    );
    expect(wrapper.find('h3').text()).to.equal('Benefit end date');
    expect(
      wrapper
        .find('div')
        .at(1)
        .text(),
    ).to.equal('There’s no time limit to use these education benefits.');
    wrapper.unmount();
  });

  it('should return undefined for unknown condition', () => {
    const result = benefitEndDateExplanation('unknown');
    expect(result).to.be.undefined;
  });
  it('should return not qualified warning component', () => {
    expect(notQualifiedWarning()).not.to.be.undefined;
  });
  it('renders the button with correct text and calls window.history.back on click', () => {
    const wrapper = shallow(genericErrorMessage);
    const button = wrapper.find('va-button');
    expect(button.prop('text')).to.equal(' Back to Post-9/11 GI Bill');

    // Stub window.history.back to test if it is called on click
    const backStub = sinon.stub(window.history, 'back');
    // Simulate the button click by calling the onClick prop with an event that has preventDefault
    button.prop('onClick')({ preventDefault: () => {} });
    expect(backStub.calledOnce).to.be.true;
    backStub.restore();

    wrapper.unmount();
  });
});
