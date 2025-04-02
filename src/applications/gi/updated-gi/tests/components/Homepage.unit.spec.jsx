import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import HomePage from '../../components/Homepage';
import NewFeatureProgramsYRTAlert from '../../../components/profile/NewFeatureProgramsYRTAlert';
import LinkWithDescription from '../../components/LinkWithDescription';

describe('<HomePage />', () => {
  it('should render the title and description correctly', () => {
    const wrapper = shallow(<HomePage />);
    const title = wrapper.find('[data-testid="comparison-tool-title"]');
    const description = wrapper.find(
      '[data-testid="comparison-tool-description"]',
    );

    expect(title.text()).to.equal('GI Bill® Comparison Tool');
    expect(description.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render NewFeatureProgramsYRTAlert with the correct custom props', () => {
    const wrapper = shallow(<HomePage />);
    const alertComponent = wrapper.find(NewFeatureProgramsYRTAlert);

    expect(alertComponent.exists()).to.be.true;
    expect(alertComponent.prop('customHeadline')).to.equal(
      'Comparison Tool new features',
    );
    expect(alertComponent.prop('customParagraph')).to.equal(
      'Licenses & certifications, national exams, Yellow Ribbon, and approved programs',
    );
    wrapper.unmount();
  });

  it('should render three LinkWithDescription components with the expected text', () => {
    const wrapper = shallow(<HomePage />);
    const links = wrapper.find(LinkWithDescription);
    expect(links).to.have.lengthOf(3);

    const linkTexts = links.map(node => node.prop('text'));
    expect(linkTexts).to.include('Schools and employers');
    expect(linkTexts).to.include('Licenses, certifications, and prep courses');
    expect(linkTexts).to.include('National exams');
    wrapper.unmount();
  });

  it('should hide the alert when onClose is called', () => {
    const wrapper = mount(<HomePage />);
    let alertComponent = wrapper.find(NewFeatureProgramsYRTAlert);
    expect(alertComponent.prop('visible')).to.be.true;
    alertComponent.prop('onClose')();
    wrapper.update();
    alertComponent = wrapper.find(NewFeatureProgramsYRTAlert);
    expect(alertComponent.prop('visible')).to.be.false;
    wrapper.unmount();
  });
});
