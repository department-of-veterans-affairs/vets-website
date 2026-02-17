import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import YellowRibbonSelector from '../../../components/profile/YellowRibbonSelector';
import { yellowRibbonDegreeLevelTypeHash } from '../../../constants';
import * as helpers from '../../helpers';

describe('YellowRibbonSelector component', () => {
  let wrapper;
  let deriveEligibleStudentsStub;
  let deriveMaxAmountStub;
  let originalHash;

  const programs = [
    {
      divisionProfessionalSchool: 'Program A',
      degreeLevel: 'bachelor',
      numberOfStudents: 10,
      contributionAmount: 5000,
    },
    {
      divisionProfessionalSchool: 'Program B',
      degreeLevel: 'master',
      numberOfStudents: 5,
      contributionAmount: 10000,
    },
    {
      divisionProfessionalSchool: 'Program C',
      degreeLevel: 'all',
      numberOfStudents: 2,
      contributionAmount: 2000,
    },
  ];

  const setup = (props = {}) => mount(<YellowRibbonSelector {...props} />);

  before(() => {
    // Store original hash before all tests
    originalHash = { ...yellowRibbonDegreeLevelTypeHash };
  });

  beforeEach(() => {
    // Stub helper functions before each test
    deriveEligibleStudentsStub = sinon
      .stub(helpers, 'deriveEligibleStudents')
      .callsFake(num => (num ? `${num} students` : 'Not provided'));

    deriveMaxAmountStub = sinon
      .stub(helpers, 'deriveMaxAmount')
      .callsFake(amount => (amount ? `$${amount}` : 'Not provided'));

    // Set custom hash for the tests
    yellowRibbonDegreeLevelTypeHash.bachelor = ['Bachelors'];
    yellowRibbonDegreeLevelTypeHash.master = ['Masters'];
  });

  afterEach(() => {
    // Restore the stubs and wrapper after each test
    deriveEligibleStudentsStub.restore();
    deriveMaxAmountStub.restore();

    // Restore the hash to its original state
    Object.keys(yellowRibbonDegreeLevelTypeHash).forEach(key => {
      delete yellowRibbonDegreeLevelTypeHash[key];
    });
    Object.assign(yellowRibbonDegreeLevelTypeHash, originalHash);

    if (wrapper && wrapper.length) {
      wrapper.unmount();
    }
  });

  it('renders a VaSelect dropdown when multiple degree level options are available', () => {
    wrapper = setup({ programs });
    const select = wrapper.find('VaSelect');
    expect(select).to.have.lengthOf(1);

    const options = wrapper.find('option');
    const optionValues = options.map(opt => opt.prop('value'));
    expect(optionValues).to.include('Bachelors');
    expect(optionValues).to.include('Masters');
  });

  it('does not show results until user clicks "Display Results" when multiple options exist', () => {
    wrapper = setup({ programs });
    // Should not show results summary or VaCards initially
    expect(wrapper.find('#results-summary').exists()).to.be.false;
    expect(wrapper.find('VaCard')).to.have.lengthOf(0);
  });

  it('returns no degree level options when the degree level key does not exist in the hash', () => {
    const unknownPrograms = [
      {
        divisionProfessionalSchool: 'Unknown Program',
        degreeLevel: 'nonExistentLevel',
        numberOfStudents: 10,
        contributionAmount: 5000,
      },
    ];
    wrapper = setup({ programs: unknownPrograms });
    wrapper.update();

    const select = wrapper.find('VaSelect');
    expect(select.exists()).to.be.false;
    expect(wrapper.find('#results-summary').exists()).to.be.false;
    expect(wrapper.find('VaCard')).to.have.lengthOf(0);
  });

  // it('auto-selects and displays results when only one degree level is available', () => {
  //   const singleProgram = [
  //     {
  //       divisionProfessionalSchool: 'Program D',
  //       degreeLevel: 'bachelor',
  //       numberOfStudents: 3,
  //       contributionAmount: 3000,
  //     },
  //   ];
  //   wrapper = setup({ programs: singleProgram });
  //   wrapper.update();

  //   const cards = wrapper.find('VaCard');
  //   expect(cards).to.have.lengthOf(1);
  //   expect(cards.at(0).text()).to.contain('Program D');

  //   const summary = wrapper.find('#results-summary');
  //   expect(summary.text()).to.contain('result for "Bachelors" degree level');
  //   expect(summary.text()).to.contain('Showing 1-1 of 1 result');
  // });

  // it('paginates results and renders summary correctly', () => {
  //   const manyPrograms = [
  //     {
  //       divisionProfessionalSchool: 'Prog1',
  //       degreeLevel: 'bachelor',
  //       numberOfStudents: 1,
  //       contributionAmount: 100,
  //     },
  //     {
  //       divisionProfessionalSchool: 'Prog2',
  //       degreeLevel: 'bachelor',
  //       numberOfStudents: 2,
  //       contributionAmount: 200,
  //     },
  //     {
  //       divisionProfessionalSchool: 'Prog3',
  //       degreeLevel: 'bachelor',
  //       numberOfStudents: 3,
  //       contributionAmount: 300,
  //     },
  //     {
  //       divisionProfessionalSchool: 'Prog4',
  //       degreeLevel: 'bachelor',
  //       numberOfStudents: 4,
  //       contributionAmount: 400,
  //     },
  //     {
  //       divisionProfessionalSchool: 'Prog5',
  //       degreeLevel: 'bachelor',
  //       numberOfStudents: 5,
  //       contributionAmount: 500,
  //     },
  //   ];

  //   wrapper = setup({ programs: manyPrograms });
  //   wrapper.update();

  //   // Check initial state after auto-selection
  //   let cards = wrapper.find('VaCard');
  //   // expect(cards).to.have.lengthOf(3);
  //   expect(cards.at(0).text()).to.contain('Prog1');
  //   expect(cards.at(1).text()).to.contain('Prog2');
  //   expect(cards.at(2).text()).to.contain('Prog3');

  //   let summary = wrapper.find('#results-summary');
  //   expect(summary.exists()).to.be.true;
  //   expect(summary.text()).to.contain(
  //     'Showing 1-3 of 5 results for "Bachelors" degree level',
  //   );

  //   // Navigate to the second page
  //   wrapper.find('VaPagination').prop('onPageSelect')({ detail: { page: 2 } });
  //   wrapper.update();

  //   // Check second-page results
  //   cards = wrapper.find('VaCard');
  //   expect(cards).to.have.lengthOf(2);
  //   expect(cards.at(0).text()).to.contain('Prog4');
  //   expect(cards.at(1).text()).to.contain('Prog5');

  //   summary = wrapper.find('#results-summary');
  //   expect(summary.exists()).to.be.true;
  //   expect(summary.text()).to.contain(
  //     'Showing 4-5 of 5 results for "Bachelors" degree level',
  //   );
  // });

  it('shows no results if chosen degree level yields no matches', () => {
    wrapper = setup({ programs });
    // Choose "Doctoral" which doesn't exist in these programs
    wrapper
      .find('VaSelect')
      .simulate('change', { target: { value: 'Doctoral' } });
    wrapper.find('VaButton').simulate('click');
    wrapper.update();

    expect(wrapper.find('#results-summary').exists()).to.be.false;
    expect(wrapper.find('VaCard')).to.have.lengthOf(0);
  });

  it('updates selectedOption when user selects a degree level', () => {
    wrapper = setup({ programs });

    const select = wrapper.find('VaSelect');
    expect(select.exists()).to.be.true;
    expect(select.prop('value')).to.equal('');

    select.prop('onVaSelect')({ target: { value: 'Masters' } });
    wrapper.update();

    expect(wrapper.find('VaSelect').prop('value')).to.equal('Masters');
  });
  it('does not render results summary when activeOption is falsy', () => {
    wrapper = setup({ programs });
    wrapper.update();

    // Ensure no summary is rendered initially
    expect(wrapper.find('#results-summary').exists()).to.be.false;
  });

  it('renders summary correctly when activeOption is "All"', () => {
    wrapper = setup({ programs });
    wrapper.update();

    // Simulate selecting "All"
    yellowRibbonDegreeLevelTypeHash.all = ['All'];
    const select = wrapper.find('VaSelect');
    select.prop('onVaSelect')({ target: { value: 'All' } });
    wrapper.update();

    wrapper
      .find('VaButton')
      .getDOMNode()
      .click();
    wrapper.update();

    const summary = wrapper.find('#results-summary');
    expect(summary.exists()).to.be.true;
    expect(summary.text()).to.contain(
      'Showing 1-1 of 1 result for "All" degree levels',
    );
  });

  it('renders summary correctly when activeOption is a specific degree level and degreeLevelOptions.length === 1', () => {
    wrapper = setup({ programs });
    wrapper.update();

    // Simulate selecting "Masters"
    const select = wrapper.find('VaSelect');
    select.prop('onVaSelect')({ target: { value: 'Masters' } });
    wrapper
      .find('VaButton')
      .getDOMNode()
      .click();
    wrapper.update();

    const summary = wrapper.find('#results-summary');
    expect(summary.exists()).to.be.true;
    expect(summary.text()).to.contain(
      'Showing 1-1 of 1 result for "Masters" degree level',
    );
  });
});
