import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  addDependentOptions,
  removeDependentOptions,
  validateAtLeastOneSelected,
  OptionsReviewField,
} from '../../../../../config/chapters/taskWizard/wizard/helpers';

const mockErrors = {
  addError: () => {},
};
const addErrorSpy = sinon.spy(mockErrors, 'addError');

describe('addDependentOptions', () => {
  it('should match the snapshot', () => {
    expect(addDependentOptions).to.deep.equal({
      addSpouse: 'My spouse',
      addChild: 'An unmarried child under 18',
      report674:
        'An unmarried child between ages 18 and 23, and who attends school',
      addDisabledChild:
        'An unmarried child of any age who has a permanent mental or physical disability ',
    });
  });
});

describe('removeDependentOptions', () => {
  it('should match the snapshot', () => {
    expect(removeDependentOptions).to.deep.equal({
      reportDivorce: 'A spouse I divorced',
      reportDeath: 'A spouse, child, or parent who died',
      reportStepchildNotInHousehold:
        'A stepchild who doesn’t live with me or receive financial support from me anymore',
      reportMarriageOfChildUnder18: 'A child who got married',
      reportChild18OrOlderIsNotAttendingSchool:
        'A child between ages 18 and 23 because they left school',
    });
  });
});

describe('validateAtLeastOneSelected', () => {
  beforeEach(() => {
    addErrorSpy.reset();
  });

  it('should add an error if no option is selected', () => {
    const fieldData = {
      addSpouse: false,
      addChild: false,
    };

    validateAtLeastOneSelected(mockErrors, fieldData);

    expect(addErrorSpy.calledWith('Select at least one option')).to.be.true;
  });

  it('should not add an error if at least one option is selected', () => {
    const fieldData = {
      addSpouse: true,
      addChild: false,
    };

    validateAtLeastOneSelected(mockErrors, fieldData);

    expect(addErrorSpy.notCalled).to.be.true;
  });
});

describe('OptionsReviewField', () => {
  it('should render null if children or formData is not provided', () => {
    const { container } = render(<OptionsReviewField />);
    expect(container.firstChild).to.be.null;
  });

  it('should render review row if children and formData are provided', () => {
    const props = {
      children: {
        props: {
          formData: true,
          uiSchema: { 'ui:title': 'Test Title' },
        },
      },
    };

    const { getByText } = render(<OptionsReviewField {...props} />);

    expect(getByText('Test Title')).to.exist;
  });
});
