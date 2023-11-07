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
});
