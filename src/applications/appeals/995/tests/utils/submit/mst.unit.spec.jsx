import { expect } from 'chai';
import { optionForMstChoices } from '../../../content/optionIndicator';
import { getMstData } from '../../../utils/submit/mst';
import { MST_OPTION } from '../../../constants';

describe('getMstData', () => {
  const setup = ({ option = true, choice = '' } = {}) =>
    getMstData({
      [MST_OPTION]: option,
      optionIndicator: choice,
    });

  it('should return empty object if nothing selected', () => {
    expect(setup()).to.deep.equal({});
  });

  it('should return empty object if choice does not exist', () => {
    expect(setup({ choice: 'test' })).to.deep.equal({});
  });

  it('should return content if yes', () => {
    expect(setup({ choice: 'yes' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.yes,
    });
  });

  it('should return no content if no', () => {
    expect(setup({ choice: 'no' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.no,
    });
  });

  it('should return content if revoke', () => {
    expect(setup({ choice: 'revoke' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.revoke,
    });
  });

  it('should return content if notEnrolled', () => {
    expect(setup({ choice: 'notEnrolled' })).to.deep.equal({
      mstUpcomingEventDisclosure: optionForMstChoices.notEnrolled,
    });
  });
});
