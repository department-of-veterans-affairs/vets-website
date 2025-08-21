import { expect } from 'chai';
import { shallow } from 'enzyme';
import WelcomeVAContactAdditionalInfo from '../../../components/WelcomeVAContactAdditionalInfo';

describe('<WelcomeVAContactAdditionalInfo />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(WelcomeVAContactAdditionalInfo);
  });

  it('renders as expected', () => {
    expect(wrapper.exists()).to.be.true;
  });

  it('renders a <va-additional-info> component', () => {
    const additionalInfo = wrapper.find('va-additional-info');
    expect(additionalInfo.exists()).to.be.true;
    expect(additionalInfo.prop('trigger')).to.equal(
      'Which benefits and services does VA use this contact information for?',
    );
  });

  it('renders the correct paragraph texts', () => {
    const paragraphs = wrapper.find('p');
    expect(paragraphs).to.have.lengthOf(3);
    expect(paragraphs.at(0).text()).to.include(
      'We use this information to contact you about these VA benefits and services:',
    );
    expect(paragraphs.at(1).text()).to.include(
      'If you’re enrolled in VA health care, we also use this information to send you these:',
    );
    expect(paragraphs.at(2).text()).to.include(
      'Find out how to change your contact information for other VA benefits',
    );
  });

  it('renders the correct unordered lists and list items', () => {
    const lists = wrapper.find('ul');
    expect(lists).to.have.lengthOf(2);

    const firstListItems = lists.at(0).find('li');
    expect(firstListItems).to.have.lengthOf(4);
    expect(firstListItems.at(0).text()).to.equal('Disability compensation');
    expect(firstListItems.at(1).text()).to.equal('Pension benefits');
    expect(firstListItems.at(2).text()).to.equal('Claims and appeals');
    expect(firstListItems.at(3).text()).to.equal(
      'Veteran Readiness and Employment (VR&E)',
    );

    const secondListItems = lists.at(1).find('li');
    expect(secondListItems).to.have.lengthOf(4);
    expect(secondListItems.at(0).text()).to.equal('Appointment reminders');
    expect(secondListItems.at(1).text()).to.equal(
      'Communications from your VA medical center',
    );
    expect(secondListItems.at(2).text()).to.equal('Lab and test results');
    expect(secondListItems.at(3).text()).to.include(
      'Prescription medicines (we send your medicines to your mailing address)',
    );
  });

  it('renders a link with the correct href and text', () => {
    const link = wrapper.find('a');
    expect(link.exists()).to.be.true;
    expect(link.prop('href')).to.equal(
      '/resources/change-your-address-on-file-with-va/#change-your-address-by-contact',
    );
    expect(link.text()).to.include(
      'Find out how to change your contact information for other VA benefits',
    );
  });
});
