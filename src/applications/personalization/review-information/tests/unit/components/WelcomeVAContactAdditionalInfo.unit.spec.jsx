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
    expect(paragraphs).to.have.lengthOf(2);
    expect(paragraphs.at(0).text()).to.include(
      'We use this information to contact you about VA benefits like',
    );
  });

  it('renders a link with the correct href and text', () => {
    const link = wrapper.find('va-link');
    expect(link.exists()).to.be.true;
    expect(link.prop('href')).to.contain(
      '/resources/change-your-address-on-file-with-va/#change-your-address-by-contact',
    );
    expect(link.prop('text')).to.contain(
      'Learn how to change your address and other contact information for different VA benefits',
    );
  });
});
