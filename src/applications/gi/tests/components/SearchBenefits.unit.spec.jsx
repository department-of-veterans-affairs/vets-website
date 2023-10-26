import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import SearchBenefits from '../../components/SearchBenefits';

describe('SearchBenefits', () => {
  it('it should handle change correctly', () => {
    const setGiBillChapter = sinon.spy();
    const setMilitaryStatus = sinon.spy();
    const wrapper = shallow(
      <SearchBenefits
        giBillChapter=""
        militaryStatus=""
        setGiBillChapter={setGiBillChapter}
        setMilitaryStatus={setMilitaryStatus}
      />,
    );
    const event = { target: { name: 'militaryStatus', value: 'spouse' } };
    wrapper.find('[name="militaryStatus"]').simulate('change', event);
    expect(setMilitaryStatus.calledWith('spouse')).to.be.true;
    expect(setGiBillChapter.calledWith('33a')).to.be.true;
    wrapper.unmount();
  });
});
