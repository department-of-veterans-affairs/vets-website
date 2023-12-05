import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ContactInformation from '../../../components/profile/ContactInformation';

describe('<ContactInformation>', () => {
  it('should render', () => {
    const tree = shallow(<ContactInformation institution={{}} />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
  it('should render institution type', () => {
    const institution = {
      physicalAddress1: '123 some-st city state, 123456',
      physicalAddress2: '123 some-st2 city state, 678902',
      physicalAddress3: '345 physicalAddress3',
      address1: 'some Address',
      address2: 'address2',
      address3: 'address3',
      type: 'ojt',
      vetPoc: 'true',
    };
    const tree = shallow(<ContactInformation institution={institution} />);
    expect(
      tree
        .find('div.vads-l-row.vads-u-margin-top--2p5.vads-u-margin-bottom--4')
        .text()
        .includes(
          'Physical address123 some-st city state, 123456123 some-st2 city state, 678902345 physicalAddress3',
        ),
    ).to.be.true;
    expect(
      tree
        .find('div.vads-l-row.vads-u-margin-top--0.vads-u-margin-bottom--4')
        .text()
        .includes('ome Address'),
    ).to.to.true;
    expect(
      tree
        .find('div.vads-l-col--9 > div')
        .last()
        .text()
        .includes('some Addressaddress2address3'),
    ).to.be.true;
    tree.unmount();
  });
  it('should calles showModal with singleContact', () => {
    const institution = {
      physicalAddress1: '123 some-st city state, 123456',
      physicalAddress2: '123 some-st2 city state, 678902',
      physicalAddress3: '345 physicalAddress3',
      address1: 'some Address',
      type: 'ojt33',
    };
    const showModalSpy = sinon.stub();
    const tree = shallow(
      <ContactInformation institution={institution} showModal={showModalSpy} />,
    );
    const btn1 = tree.find('LearnMoreLabel').first();
    btn1.simulate('click');
    expect(showModalSpy.calledWith('singleContact')).to.be.true;
    expect(
      tree
        .find('div.small-screen-font div')
        .last()
        .text(),
    ).to.not.equal('Yes');
    const btn2 = tree.find('LearnMoreLabel').at(1);
    btn2.simulate('click');
    expect(showModalSpy.calledWith('singleContact')).to.be.true;
    tree.unmount();
  });
  it('should calles showModal with facilityCode', () => {
    const institution = {
      physicalAddress1: '123 some-st city state, 123456',
      physicalAddress2: '123 some-st2 city state, 678902',
      physicalAddress3: '345 physicalAddress3',
      address1: 'some Address',
      type: 'ojt66',
    };
    const showModalSpy = sinon.stub();
    const tree = shallow(
      <ContactInformation institution={institution} showModal={showModalSpy} />,
    );
    const btn1 = tree.find('LearnMoreLabel').at(1);
    btn1.simulate('click');
    expect(showModalSpy.calledWith('facilityCode')).to.be.true;
    tree.unmount();
  });
  it('should calles showModal with opeCode', () => {
    const institution = {
      physicalAddress1: '123 some-st city state, 123456',
      physicalAddress2: '123 some-st2 city state, 678902',
      physicalAddress3: '345 physicalAddress3',
      address1: 'some Address',
      type: 'ojt66',
    };
    const showModalSpy = sinon.stub();
    const tree = shallow(
      <ContactInformation institution={institution} showModal={showModalSpy} />,
    );
    const btn1 = tree.find('LearnMoreLabel').at(3);
    btn1.simulate('click');
    expect(showModalSpy.calledWith('opeCode')).to.be.true;
    tree.unmount();
  });
  it('should calles showModal with ipedsCode', () => {
    const institution = {
      physicalAddress1: '123 some-st city state, 123456',
      physicalAddress2: '123 some-st2 city state, 678902',
      physicalAddress3: '345 physicalAddress3',
      address1: 'some Address',
      type: 'ojt66',
    };
    const showModalSpy = sinon.stub();
    const tree = shallow(
      <ContactInformation institution={institution} showModal={showModalSpy} />,
    );
    const btn1 = tree.find('LearnMoreLabel').at(2);
    btn1.simulate('click');
    expect(showModalSpy.calledWith('ipedsCode')).to.be.true;
    tree.unmount();
  });

  it('should render physical address when provided', () => {
    const institution = {
      physicalAddress1: '123 Main St',
      physicalCity: 'Sample City',
      physicalState: 'CA',
      physicalZip: '12345',
    };

    const wrapper = shallow(<ContactInformation institution={institution} />);

    expect(wrapper.find('.contact-heading').text()).to.equal(
      'Physical address',
    );
    expect(
      wrapper
        .find('.small-screen-font')
        .at(1)
        .text(),
    ).to.include('123 Main St');
    expect(
      wrapper
        .find('.small-screen-font')
        .at(1)
        .text(),
    ).to.include('Sample City, CA 12345');
    wrapper.unmount();
  });

  it('should render mailing address when provided', () => {
    const institution = {
      address1: '456 Elm St',
      city: 'Another City',
      state: 'NY',
      zip: '54321',
    };

    const wrapper = shallow(<ContactInformation institution={institution} />);

    expect(wrapper.find('.contact-heading').text()).to.equal('Mailing address');
    expect(
      wrapper
        .find('.small-screen-font')
        .at(1)
        .text(),
    ).to.include('Single point');
    expect(
      wrapper
        .find('.small-screen-font')
        .at(1)
        .text(),
    ).to.include('Single point');
    wrapper.unmount();
  });

  it('should render "Single point of contact" when vetPoc is true', () => {
    const institution = {
      vetPoc: true,
    };

    const wrapper = shallow(<ContactInformation institution={institution} />);
    expect(
      wrapper
        .find('.small-screen-font')
        .at(1)
        .text(),
    ).to.include('Single point of contact');
    wrapper.unmount();
  });

  it('should render primary school certifying officials', () => {
    const institution = {
      versionedSchoolCertifyingOfficials: [
        { priority: 'PRIMARY', name: 'John Doe' },
        { priority: 'SECONDARY', name: 'Jane Smith' },
      ],
    };

    const wrapper = shallow(<ContactInformation institution={institution} />);

    expect(wrapper.find('#primary-contact-header').text()).to.equal('Primary');
    expect(wrapper.find('.sco-list li')).to.have.length(1);
    expect(wrapper.find('.sco-list li').text()).to.include('');
    wrapper.unmount();
  });

  it('should render institution codes', () => {
    const institution = {
      facilityCode: '12345678',
      cross: 'CROSSCODE',
      ope: 'OPECODE',
    };

    const wrapper = shallow(<ContactInformation institution={institution} />);

    expect(
      wrapper
        .find('.vads-u-margin-top--5')
        .at(1)
        .text(),
    ).to.include('Institution codes');
    expect(
      wrapper
        .find('.vads-u-margin-top--5')
        .at(1)
        .text(),
    ).to.include('Institution codes');
    expect(
      wrapper
        .find('.vads-u-margin-top--5')
        .at(1)
        .text(),
    ).to.include('Institution codes');
    expect(
      wrapper
        .find('.vads-u-margin-top--5')
        .at(1)
        .text(),
    ).to.include('Institution codes');
    wrapper.unmount();
  });
});
