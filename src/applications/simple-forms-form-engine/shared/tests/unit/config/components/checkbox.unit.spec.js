import { expect } from 'chai';
import checkbox from 'applications/simple-forms-form-engine/shared/config/components/checkbox';
import * as checkboxGroupPattern from 'platform/forms-system/src/js/web-component-patterns/checkboxGroupPattern';
import sinon from 'sinon';

describe('checkbox', () => {
  const component = {
    hint: null,
    id: '172746',
    label: 'A single checkbox option can be used to confirm agreement',
    required: true,
    type: 'digital_form_checkbox',
    responseOptions: [
      {
        id: '172745',
        label: 'I agree with this statement',
        description:
          'I agree to be bound forever and always by this statement.',
      },
    ],
  };

  it('is a tuple', () => {
    const schemas = checkbox(component);
    expect(schemas.length).to.eq(2);
  });

  describe('schema', () => {
    beforeEach(() => {
      sinon.spy(checkboxGroupPattern, 'checkboxGroupSchema');
    });

    afterEach(() => {
      checkboxGroupPattern.checkboxGroupSchema.restore();
    });

    it('calls the schema function with the correct args', () => {
      checkbox(component);

      expect(
        checkboxGroupPattern.checkboxGroupSchema.calledWithMatch([
          'iAgreeWithThisStatement',
        ]),
      ).to.eq(true);
    });
  });

  describe('uiSchema', () => {
    beforeEach(() => {
      sinon.spy(checkboxGroupPattern, 'checkboxGroupUI');
    });

    afterEach(() => {
      checkboxGroupPattern.checkboxGroupUI.restore();
    });

    it('calls the correct UI function', () => {
      checkbox(component);

      expect(
        checkboxGroupPattern.checkboxGroupUI.calledWithMatch({
          title: component.label,
          hint: component.hint,
          labels: {
            iAgreeWithThisStatement: {
              title: component.responseOptions[0].label,
              description: component.responseOptions[0].description,
            },
          },
        }),
      ).to.eq(true);
    });
  });
});
