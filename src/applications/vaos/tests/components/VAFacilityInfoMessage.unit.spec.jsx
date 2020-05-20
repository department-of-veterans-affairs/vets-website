import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import VAFacilityInfoMessage from '../../components/VAFacilityInfoMessage';

describe('<VAFacilityInfoMessage>', () => {
  it('should display facility alert', () => {
    const facility = {
      name: 'Test facility',
      address: [
        {
          city: 'Northampton',
          state: 'MA',
        },
      ],
    };

    const tree = shallow(<VAFacilityInfoMessage facility={facility} />);

    const alert = tree.find('AlertBox');
    expect(alert.dive().text()).to.contain('Test facility');
    expect(alert.dive().text()).to.contain('Northampton, MA');
    expect(
      alert
        .dive()
        .find('a')
        .props().href,
    ).to.contain('/find-locations');
    tree.unmount();
  });
});
