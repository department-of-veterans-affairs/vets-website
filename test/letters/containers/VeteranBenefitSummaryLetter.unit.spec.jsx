import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import SkinDeep from 'skin-deep';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import _ from 'lodash/fp';

import { VeteranBenefitSummaryLetter } from '../../../src/js/letters/containers/VeteranBenefitSummaryLetter';

const defaultProps = {
  benefitSummaryOptions: {
    benefitInfo: {
      hasAdaptedHousing: true,
      hasChapter35Eligibility: false
    },
    serviceInfo: [
      {
        branch: 'ARMY',
        characterOfService: 'UNCHARACTERIZED',
        enteredDate: '1965-01-01T05:00:00.000+00:00',
        releasedDate: '1972-10-01T04:00:00.000+00:00'
      }
    ]
  },
  isVeteran: true,
  optionsAvailable: true,
  requestOptions: {},
  updateBenefitSummaryRequestOption: () => {}
};

describe('<VeteranBenefitSummaryLetter>', () => {
  it('renders', () => {
    const tree = SkinDeep.shallowRender(<VeteranBenefitSummaryLetter {...defaultProps}/>);
    expect(tree.type).to.equal('div');
  });

  it('should show benefit info options', () => {
    const tree = SkinDeep.shallowRender(<VeteranBenefitSummaryLetter {...defaultProps}/>);
    const rows = tree.dive(['div', '#benefitInfoTable', 'tbody']).everySubTree('tr');
    expect(rows[0].dive(['th', 'input'])).not.to.be.empty;
    expect(rows[0].dive(['td', '#hasAdaptedHousingLabel'])).not.to.be.empty;

    expect(rows[1].dive(['th', 'input'])).not.to.be.empty;
    expect(rows[1].dive(['td', '#hasChapter35EligibilityLabel'])).not.to.be.empty;
  });

  it('should show service info options', () => {
    const tree = SkinDeep.shallowRender(<VeteranBenefitSummaryLetter {...defaultProps}/>);
    expect(tree.subTree('#militaryService')).not.to.be.empty;
  });

  it('should update request option when checked', () => {
    const updateOption = sinon.spy();
    const props = _.set('updateBenefitSummaryRequestOption', updateOption, defaultProps);
    const component = ReactTestUtils.renderIntoDocument(
      <VeteranBenefitSummaryLetter {...props}/>
    );

    const formDOM = findDOMNode(component);
    const inputs = formDOM.querySelectorAll('input');
    expect(inputs.length).to.equal(3);

    ReactTestUtils.Simulate.change(inputs[0], {
      target: {
        checked: false
      }
    });
    ReactTestUtils.Simulate.change(inputs[1], {
      target: {
        checked: false
      }
    });

    expect(updateOption.calledTwice).to.be.true;
  });

  it('pushes toggled options to the global window dataLayer', () => {
    const oldWindow = { ...global.window };
    global.window = {
      dataLayer: [],
    };

    expect(global.window.dataLayer.length).to.equal(0);

    const component = ReactTestUtils.renderIntoDocument(
      <VeteranBenefitSummaryLetter {...defaultProps}/>
    );

    const formDOM = findDOMNode(component);
    const inputs = formDOM.querySelectorAll('input');

    ReactTestUtils.Simulate.change(inputs[0], {
      target: {
        id: 0,
        checked: false
      }
    });

    const expectedValue = {
      event: 'letter-benefit-option-clicked',
      'letter-benefit-option': 0,
      'letter-benefit-option-status': 'unchecked'
    };

    expect(global.window.dataLayer.length).to.equal(1);
    expect(global.window.dataLayer[0]).to.eql(expectedValue);

    global.window = { ...oldWindow };
  });

  it('Does not render dependent options for veterans', () => {
    const tree = SkinDeep.shallowRender(<VeteranBenefitSummaryLetter {...defaultProps}/>);
    const benefitInfoRows = tree.dive(['div', '#benefitInfoTable', 'tbody']).everySubTree('tr');
    benefitInfoRows.forEach((row) => {
      expect(() => row.dive(['td', '#hasDeathResultOfDisability'])).to.throw();
    });
  });

  it('Does not render veteran options for dependents', () => {
    const dependentProps = { isVeteran: false, ...defaultProps };
    const tree = SkinDeep.shallowRender(<VeteranBenefitSummaryLetter {...dependentProps}/>);
    const benefitInfoRows = tree.dive(['div', '#benefitInfoTable', 'tbody']).everySubTree('tr');
    benefitInfoRows.forEach((row) => {
      expect(() => row.dive(['td', '#hasServiceConnectedDisabilities'])).to.throw();
    });
  });
});
