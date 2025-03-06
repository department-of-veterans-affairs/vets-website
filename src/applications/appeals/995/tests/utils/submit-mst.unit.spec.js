import { expect } from 'chai';

import { optionForMstChoices } from '../../content/optionIndicator';
import { getMstData } from '../../utils/submit/mst';

import { SC_NEW_FORM_DATA, MST_OPTION } from '../../constants';

describe('getMstData', () => {
  const setup = ({ toggle = true, option = true, choice = '' } = {}) =>
    getMstData({
      [SC_NEW_FORM_DATA]: toggle,
      [MST_OPTION]: option,
      optionIndicator: choice,
    });

  it('should return empty object if not in new form', () => {
    expect(setup({ toggle: false })).to.deep.equal({});
  });

  it('should return empty object if nothing selected', () => {
    expect(setup({ toggle: true })).to.deep.equal({});
  });

  it('should return empty object if choice does not exist', () => {
    expect(setup({ toggle: true, choice: 'test' })).to.deep.equal({});
  });

  it('should return content if yes', () => {
    expect(setup({ toggle: true, choice: 'yes' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.yes,
    });
  });

  it('should return no content if no', () => {
    expect(setup({ toggle: true, choice: 'no' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.no,
    });
  });

  it('should return content if revoke', () => {
    expect(setup({ toggle: true, choice: 'revoke' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.revoke,
    });
  });

  it('should return content if notEnrolled', () => {
    expect(setup({ toggle: true, choice: 'notEnrolled' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.notEnrolled,
    });
  });
});
