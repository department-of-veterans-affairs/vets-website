import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';
import { validateBirthPostalCode } from '../../../../config/chapters/report-add-child/placeOfBirth';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addChild: true,
  },
  childrenToAdd: [{}],
};
describe('686 add child place of birth', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildPlaceOfBirth;

  it('should render', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    const formDOM = getFormDOM(form);
    expect(formDOM.querySelectorAll('va-select').length).to.eq(1);
  });
});

describe('validateBirthPostalCode', () => {
  let errors;

  beforeEach(() => {
    errors = { addError: sinon.spy() };
  });

  it('does nothing when postalCode is undefined', () => {
    validateBirthPostalCode(errors, undefined, {}, null, null, 0);
    expect(errors.addError.called).to.be.false;
  });

  it('does nothing when postalCode is an empty string', () => {
    validateBirthPostalCode(errors, '', {}, null, null, 0);
    expect(errors.addError.called).to.be.false;
  });

  it('does nothing for a valid 5-digit US postal code', () => {
    validateBirthPostalCode(errors, '12345', {}, null, null, 0);
    expect(errors.addError.called).to.be.false;
  });

  it('adds an error for a non-5-digit postal code when inside the US', () => {
    const fd = { childrenToAdd: [{ birthLocation: { outsideUsa: false } }] };
    validateBirthPostalCode(errors, '1234', fd, null, null, 0);
    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Enter a valid 5-digit postal code',
    );
  });

  it('adds an error for a 6-digit postal code when inside the US', () => {
    const fd = { childrenToAdd: [{ birthLocation: { outsideUsa: false } }] };
    validateBirthPostalCode(errors, '123456', fd, null, null, 0);
    expect(errors.addError.calledOnce).to.be.true;
  });

  it('adds an error for a non-numeric postal code when inside the US', () => {
    const fd = { childrenToAdd: [{ birthLocation: { outsideUsa: false } }] };
    validateBirthPostalCode(errors, 'ABCDE', fd, null, null, 0);
    expect(errors.addError.calledOnce).to.be.true;
  });

  it('does nothing for an invalid postal code when outsideUsa is true via childrenToAdd', () => {
    const fd = { childrenToAdd: [{ birthLocation: { outsideUsa: true } }] };
    validateBirthPostalCode(errors, 'ABCDE12345', fd, null, null, 0);
    expect(errors.addError.called).to.be.false;
  });

  it('uses the correct array index when multiple children exist', () => {
    const fd = {
      childrenToAdd: [
        { birthLocation: { outsideUsa: false } },
        { birthLocation: { outsideUsa: true } },
      ],
    };
    const errorsInside = { addError: sinon.spy() };
    const errorsOutside = { addError: sinon.spy() };

    // index 0 is inside USA — should error
    validateBirthPostalCode(errorsInside, 'ABCDE', fd, null, null, 0);
    expect(errorsInside.addError.calledOnce).to.be.true;

    // index 1 is outside USA — should not error
    validateBirthPostalCode(errorsOutside, 'ABCDE', fd, null, null, 1);
    expect(errorsOutside.addError.called).to.be.false;
  });

  it('does nothing for an invalid postal code when outsideUsa is true via formData.birthLocation', () => {
    const fd = { birthLocation: { outsideUsa: true } };
    validateBirthPostalCode(errors, 'ABCDE12345', fd, null, null, 0);
    expect(errors.addError.called).to.be.false;
  });

  it('adds an error when formData has no outsideUsa flag', () => {
    validateBirthPostalCode(errors, '1234', {}, null, null, 0);
    expect(errors.addError.calledOnce).to.be.true;
  });
});
