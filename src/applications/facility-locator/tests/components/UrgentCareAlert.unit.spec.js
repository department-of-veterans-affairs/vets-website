import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import UrgentCareAlert from '../../containers/UrgentCareAlert';

describe('<UrgentCareAlert>', () => {
  it('Should always render when used.', () => {
    const wrapper = shallow(<UrgentCareAlert />);
    expect(wrapper.type()).to.not.equal(null);
    const divs = wrapper.find('div');
    expect(divs.length).to.equal(2);
    const dl = wrapper.find('dl');
    expect(dl.length).to.equal(1);
    const dt = wrapper.find('dt');
    expect(dt.length).to.equal(1);
    const dd = wrapper.find('dd');
    expect(dd.length).to.equal(1);
    const button = wrapper.find('button');
    expect(button.length).to.equal(1);
    wrapper.unmount();
  });
  it('should render with style props', () => {
    const headingStyle = {
      fontWeight: '700',
      fontFamily: 'Bitter, Georgia, Cambria, Times New Roman, Times, serif',
      lineHeight: '1.3',
      clear: 'both',
    };
    const ddStyle = {
      margin: '2rem 0 .5rem 0',
      lineHeight: '1.5',
    };
    const wrapper = shallow(
      <UrgentCareAlert ddStyle={ddStyle} headingStyle={headingStyle} />,
    );
    expect(wrapper.type()).to.not.equal(null);
    expect(wrapper.find('dd').prop('style')).to.have.property(
      'margin',
      ddStyle.margin,
    );
    expect(wrapper.find('dd').prop('style')).to.have.property(
      'lineHeight',
      ddStyle.lineHeight,
    );

    expect(wrapper.find('dt').prop('style')).to.have.property(
      'fontWeight',
      headingStyle.fontWeight,
    );
    expect(wrapper.find('dt').prop('style')).to.have.property(
      'fontFamily',
      headingStyle.fontFamily,
    );
    expect(wrapper.find('dt').prop('style')).to.have.property(
      'lineHeight',
      headingStyle.lineHeight,
    );

    wrapper.unmount();
  });
});
