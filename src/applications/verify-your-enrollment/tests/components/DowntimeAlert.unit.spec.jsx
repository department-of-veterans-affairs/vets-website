import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { waitFor } from '@testing-library/react';
import DowntimeAlert from '../../components/DowntimeAlert';

describe('<DowntimeAlert/>', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<DowntimeAlert />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render a VaAlert with correct props', async () => {
    const wrapper = mount(<DowntimeAlert />);
    await waitFor(() => {
      const vaAlert = wrapper.find('VaAlert');
      expect(vaAlert.exists()).to.be.true;
      expect(vaAlert.prop('visible')).to.be.true;
      expect(vaAlert.prop('status')).to.equal('warning');
      expect(vaAlert.prop('close-btn-aria-label')).to.equal(
        'Close notification',
      );
    });
    wrapper.unmount();
  });

  it('should render a headline with correct text', () => {
    const wrapper = mount(<DowntimeAlert />);
    const headline = wrapper.find('#maintenance-alert');
    expect(headline.text()).to.equal('Scheduled system downtime');
    wrapper.unmount();
  });

  it('should render three <p> elements with expected content', () => {
    const wrapper = mount(<DowntimeAlert />);
    const paragraphs = wrapper.find('p');
    expect(paragraphs).to.have.lengthOf(3);
    expect(paragraphs.at(0).text()).to.include(
      'Online enrollment verification will be unavailable',
    );
    expect(paragraphs.at(1).text()).to.include(
      "You won't need to verify your enrollment",
    );
    expect(paragraphs.at(2).text()).to.include('You can log back into VYE');
    wrapper.unmount();
  });
});
