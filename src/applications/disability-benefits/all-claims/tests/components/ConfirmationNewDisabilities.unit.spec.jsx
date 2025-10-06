import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ConfirmationNewDisabilities from '../../components/ConfirmationNewDisabilities';

describe('ConfirmationNewDisabilities', () => {
  it('should render correctly with selected new disabilities', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'Condition 1',
          cause: 'NEW',
          primaryDescription: 'Primary description 1',
        },
        {
          condition: 'Condition 2',
          cause: 'SECONDARY',
          primaryDescription: 'Primary description 2',
          'view:secondaryFollowUp': {
            causedByDisability: 'Condition A',
            causedByDisabilityDescription: 'Caused by description A',
          },
        },
      ],
    };
    const wrapper = shallow(
      <ConfirmationNewDisabilities formData={formData} />,
    );
    expect(wrapper.find('h4').length).to.equal(2);
    expect(wrapper.text()).to.include('Condition 1');
    expect(wrapper.text()).to.include('new condition; Primary description 1');
    expect(wrapper.text()).to.include('Condition 2');
    expect(wrapper.text()).to.include(
      'secondary condition; Primary description 2',
    );
    expect(wrapper.text()).to.include(
      'secondary to Condition A; Caused by description A',
    );
    wrapper.unmount();
  });

  it('should render nothing when no new disabilities are provided', () => {
    const formData = {
      newDisabilities: [],
    };
    const wrapper = shallow(
      <ConfirmationNewDisabilities formData={formData} />,
    );
    expect(wrapper.find('h4').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render nothing when formData is empty', () => {
    const wrapper = shallow(<ConfirmationNewDisabilities formData={{}} />);
    expect(wrapper.find('h4').length).to.equal(0);
    wrapper.unmount();
  });
});
