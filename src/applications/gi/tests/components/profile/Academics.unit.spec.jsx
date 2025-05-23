import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Academics from '../../../components/profile/Academics';

describe('<Academics>', () => {
  it('should render', () => {
    const tree = shallow(<Academics institution={{}} />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
  it('should call onShowModal with "accreditation" when LearnMoreLabel is clicked', () => {
    const onShowModalSpy = sinon.spy();
    const tree = shallow(
      <Academics
        institution={{
          accredited: 'accredited',
          accreditationType: 'accreditationType',
        }}
        onShowModal={onShowModalSpy}
      />,
    );
    tree
      .find('LearnMoreLabel')
      .first()
      .simulate('click');

    expect(onShowModalSpy.callCount).to.equal(1);
    expect(onShowModalSpy.calledWith('accreditation')).to.be.true;
    tree.unmount();
  });
  it('should call onShowModal with "militaryTrainingCredit" when LearnMoreLabel is clicked', () => {
    const onShowModalSpy = sinon.spy();
    const tree = shallow(
      <Academics
        institution={{ creditForMilTraining: 'creditForMilTraining' }}
        onShowModal={onShowModalSpy}
      />,
    );
    tree
      .find('LearnMoreLabel')
      .at(0)
      .simulate('click');

    expect(onShowModalSpy.callCount).to.equal(1);
    expect(onShowModalSpy.calledWith('militaryTrainingCredit')).to.be.true;
    expect(
      tree
        .find('div[aria-live="off"]')
        .at(1)
        .text()
        .trim()
        .includes('Yes'),
    ).to.be.true;
    tree.unmount();
  });
  it('should call onShowModal with "independentStudy" when LearnMoreLabel is clicked', () => {
    const onShowModalSpy = sinon.spy();
    const tree = shallow(
      <Academics
        institution={{ independentStudy: 'independentStudy' }}
        onShowModal={onShowModalSpy}
      />,
    );
    tree
      .find('LearnMoreLabel')
      .at(1)
      .simulate('click');

    expect(onShowModalSpy.callCount).to.equal(1);
    expect(onShowModalSpy.calledWith('independentStudy')).to.be.true;
    expect(
      tree
        .find('div[aria-live="off"]')
        .at(2)
        .text()
        .trim()
        .includes('Yes'),
    ).to.be.true;
    tree.unmount();
  });
  it('should call onShowModal with "priorityEnrollment" when LearnMoreLabel is clicked', () => {
    const onShowModalSpy = sinon.spy();
    const tree = shallow(
      <Academics
        institution={{ priorityEnrollment: 'priorityEnrollment' }}
        onShowModal={onShowModalSpy}
      />,
    );
    tree
      .find('LearnMoreLabel')
      .at(2)
      .simulate('click');

    expect(onShowModalSpy.callCount).to.equal(1);
    expect(onShowModalSpy.calledWith('priorityEnrollment')).to.be.true;
    expect(
      tree
        .find('div[aria-live="off"]')
        .at(3)
        .text()
        .trim()
        .includes('Yes'),
    ).to.be.true;
    tree.unmount();
  });
  it('should display "Accreditation: Yes" when accredited is true but no accreditationType', () => {
    const tree = shallow(
      <Academics institution={{ accredited: true, accreditationType: null }} />,
    );
    const accreditationBlock = tree.find('div[aria-live="off"]').at(0);
    expect(accreditationBlock.text().trim()).to.contain('Accreditation: Yes');
    tree.unmount();
  });

  it('should *not* render LearnMoreLabel for accreditation when accreditationType is null', () => {
    const onShowModalSpy = sinon.spy();
    const tree = shallow(
      <Academics
        institution={{ accredited: true, accreditationType: null }}
        onShowModal={onShowModalSpy}
      />,
    );
    const accreditationBlock = tree.find('div[aria-live="off"]').at(0);
    expect(accreditationBlock.find('LearnMoreLabel')).to.have.lengthOf(0);
    tree.unmount();
  });
});
