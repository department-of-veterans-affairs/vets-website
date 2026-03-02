import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import EstimatedBenefits from '../../../components/profile/EstimatedBenefits';

describe('<EstimatedBenefits>', () => {
  const mockProps = {
    outputs: {
      giBillPaysToSchool: { value: '$10,000', visible: true },
      tuitionAndFeesCharged: { value: '$12,000', visible: true },
      yourScholarships: { value: '$2,000', visible: true },
      outOfPocketTuition: { value: '$0', visible: true },
      housingAllowance: { value: '$1,200', visible: true },
      bookStipend: { value: '$1,000', visible: true },
      totalPaidToYou: { value: '$2,200', visible: true },
      perTerm: {},
    },
    calculator: { type: 'OJT' },
    isOJT: false,
    dispatchShowModal: () => {},
    estimatedBenefitsRef: React.createRef(),
  };
  it('should render', () => {
    const tree = shallow(
      <EstimatedBenefits
        calculator={{}}
        outputs={{
          bookStipend: {},
          giBillPaysToSchool: {},
          housingAllowance: {},
          outOfPocketTuition: {},
          perTerm: {},
          totalPaidToYou: {},
          tuitionAndFeesCharged: {},
          yourScholarships: {},
        }}
        profile={{ attributes: {} }}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
  it('displays the correct values for GI Bill pays to school', () => {
    const tree = mount(<EstimatedBenefits {...mockProps} />);
    const giBillPaysToSchool = tree.find('CalculatorResultRow').at(0);
    expect(giBillPaysToSchool.text()).to.contain(
      mockProps.outputs.giBillPaysToSchool.value,
    );
    tree.unmount();
  });

  it('conditionally renders the OJT note based on isOJT prop', () => {
    const tree = mount(<EstimatedBenefits {...mockProps} />);
    let note = tree
      .find('p')
      .filterWhere(item =>
        item
          .text()
          .includes(
            'Note: Housing rate and the amount of entitlement used decrease every 6 months as training progresses',
          ),
      );
    expect(note.exists()).to.be.false;
    tree.setProps({ isOJT: true });
    note = tree
      .find('p')
      .filterWhere(item =>
        item
          .text()
          .includes(
            'Note: Housing rate and the amount of entitlement used decrease every 6 months as training progresses',
          ),
      );
    expect(note.exists()).to.be.true;
    tree.unmount();
  });
  it('triggers dispatchShowModal when Learn More is clicked', () => {
    const tree = mount(<EstimatedBenefits {...mockProps} />);
    const fakeDispatch = sinon.spy();
    tree.setProps({ dispatchShowModal: fakeDispatch });
    const learnMoreButton = tree.find('#book-stipend-learn-more').hostNodes();
    learnMoreButton.getDOMNode().click();
    expect(fakeDispatch.calledOnce).to.be.true;
    tree.unmount();
  });
  it('renders "Months 1-6" correctly', () => {
    const outputs = {
      perTerm: {
        term1: {
          visible: true,
          title: 'Title for term 1',
          learnMoreAriaLabel: 'Learn more about term 1',
          terms: [{ label: 'Months 1-6', value: '100', visible: true }],
        },
      },
      giBillPaysToSchool: { label: '5000', value: '100', visible: true },
      tuitionAndFeesCharged: {
        label: 'Months 1-6',
        value: '100',
        visible: true,
      },
      yourScholarships: { label: 'Months 1-6', value: '100', visible: true },
      outOfPocketTuition: { label: 'Months 1-6', value: '100', visible: true },
      housingAllowance: { label: 'Months 1-6', value: '100', visible: true },
      bookStipend: { label: 'Months 1-6', value: '100', visible: true },
      totalPaidToYou: { label: 'Months 1-6', value: '100', visible: true },
    };
    const calculator = { type: 'OJT' };
    const tree = shallow(
      <EstimatedBenefits outputs={outputs} calculator={calculator} isOJT />,
    );
    const labelMonths16 = tree.find('span').filterWhere(item => {
      return item.text() === 'Months 1 through 6';
    });
    expect(labelMonths16.exists()).to.be.false;
    tree.unmount();
  });
  it('renders "Months 7-12" correctly', () => {
    const outputs = {
      perTerm: {
        term1: {
          visible: true,
          title: 'Title for term 1',
          learnMoreAriaLabel: 'Learn more about term 1',
          terms: [{ label: 'Months 7-12', value: '100', visible: true }],
        },
      },
      giBillPaysToSchool: { label: '5000', value: '100', visible: true },
      tuitionAndFeesCharged: {
        label: 'Months 7-12',
        value: '100',
        visible: true,
      },
      yourScholarships: { label: 'Months 7-12', value: '100', visible: true },
      outOfPocketTuition: { label: 'Months 7-12', value: '100', visible: true },
      housingAllowance: { label: 'Months 7-12', value: '100', visible: true },
      bookStipend: { label: 'Months 7-12', value: '100', visible: true },
      totalPaidToYou: { label: 'Months 7-12', value: '100', visible: true },
    };
    const calculator = { type: 'OJT' };
    const tree = shallow(
      <EstimatedBenefits outputs={outputs} calculator={calculator} isOJT />,
    );
    const labelMonths16 = tree.find('span').filterWhere(item => {
      return item.text() === 'Months 7 through 12';
    });
    expect(labelMonths16.exists()).to.be.false;
    tree.unmount();
  });
  it('renders "Months 13-18" correctly', () => {
    const outputs = {
      perTerm: {
        term1: {
          visible: true,
          title: 'Title for term 1',
          learnMoreAriaLabel: 'Learn more about term 1',
          terms: [{ label: 'Months 13-18', value: '100', visible: true }],
        },
      },
      giBillPaysToSchool: { label: '5000', value: '100', visible: true },
      tuitionAndFeesCharged: {
        label: 'Months 13-18',
        value: '100',
        visible: true,
      },
      yourScholarships: { label: 'Months 13-18', value: '100', visible: true },
      outOfPocketTuition: {
        label: 'Months 13-18',
        value: '100',
        visible: true,
      },
      housingAllowance: { label: 'Months 13-18', value: '100', visible: true },
      bookStipend: { label: 'Months 13-18', value: '100', visible: true },
      totalPaidToYou: { label: 'Months 13-18', value: '100', visible: true },
    };
    const calculator = { type: 'OJT' };
    const tree = shallow(
      <EstimatedBenefits outputs={outputs} calculator={calculator} isOJT />,
    );
    const labelMonths16 = tree.find('span').filterWhere(item => {
      return item.text() === 'Months 13 through 18';
    });
    expect(labelMonths16.exists()).to.be.false;
    tree.unmount();
  });
  it('renders "Months 19-24" correctly', () => {
    const outputs = {
      perTerm: {
        term1: {
          visible: true,
          title: 'Title for term 1',
          learnMoreAriaLabel: 'Learn more about term 1',
          terms: [{ label: 'Months 19-24', value: '100', visible: true }],
        },
      },
      giBillPaysToSchool: { label: '5000', value: '100', visible: true },
      tuitionAndFeesCharged: {
        label: 'Months 19-24',
        value: '100',
        visible: true,
      },
      yourScholarships: { label: 'Months 19-24', value: '100', visible: true },
      outOfPocketTuition: {
        label: 'Months 19-24',
        value: '100',
        visible: true,
      },
      housingAllowance: { label: 'Months 19-24', value: '100', visible: true },
      bookStipend: { label: 'Months 19-24', value: '100', visible: true },
      totalPaidToYou: { label: 'Months 19-24', value: '100', visible: true },
    };
    const calculator = { type: 'OJT' };
    const tree = shallow(
      <EstimatedBenefits outputs={outputs} calculator={calculator} isOJT />,
    );
    const labelMonths16 = tree.find('span').filterWhere(item => {
      return item.text() === 'Months 19 through 24';
    });
    expect(labelMonths16.exists()).to.be.false;
    tree.unmount();
  });
  it('renders va-additional-info', () => {
    const tree = mount(<EstimatedBenefits {...mockProps} />);
    const tag = tree.find('va-additional-info');
    expect(tag.length).to.eq(1);
    tree.unmount();
  });
});
