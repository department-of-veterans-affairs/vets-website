import { expect } from 'chai';

import { optionForMstChoices } from '../../content/optionIndicator';
import { getMstData } from '../../utils/submit/mst';

import { MST_OPTION } from '../../constants';

describe('getMstData', () => {
  const setup = ({ option = true, choice = '' } = {}) =>
    getMstData({
      [MST_OPTION]: option,
      optionIndicator: choice,
    });

  it('should return empty object if MST option not selected', () => {
    expect(setup({ option: false })).to.deep.equal({});
  });

  it('should return empty object if MST option true but no choice selected', () => {
    expect(setup({ option: true, choice: '' })).to.deep.equal({});
  });

  it('should return empty object if choice does not exist', () => {
    expect(setup({ option: true, choice: 'test' })).to.deep.equal({});
  });

  it('should return content if yes', () => {
    expect(setup({ option: true, choice: 'yes' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.yes,
    });
  });

  it('should return content if no', () => {
    expect(setup({ option: true, choice: 'no' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.no,
    });
  });

  it('should return content if revoke', () => {
    expect(setup({ option: true, choice: 'revoke' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.revoke,
    });
  });

  it('should return content if notEnrolled', () => {
    expect(setup({ option: true, choice: 'notEnrolled' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.notEnrolled,
    });
  });
});
