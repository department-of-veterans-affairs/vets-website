import { expect } from 'chai';
import textInput from 'applications/simple-forms-form-engine/shared/config/components/textInput';
import * as textPatterns from 'platform/forms-system/src/js/web-component-patterns/textPatterns';
import sinon from 'sinon';

describe('textInput', () => {
  const component = {
    hint: 'This is optional hint text',
    label: 'My custom text input',
    required: true,
    type: 'digital_form_text_input',
  };

  it('is a tuple', () => {
    const schemas = textInput(component);
    expect(schemas.length).to.eq(2);
  });

  describe('schema', () => {
    const [schema] = textInput(component);
    it('contains the correct type', () => {
      expect(schema.type).to.eq('string');
    });
  });

  describe('uiSchema', () => {
    beforeEach(() => {
      sinon.spy(textPatterns, 'textUI');
    });

    afterEach(() => {
      textPatterns.textUI.restore();
    });

    it('calls textUI with the correct args', () => {
      textInput(component);

      expect(
        textPatterns.textUI.calledWithMatch({
          title: component.label,
          hint: component.hint,
        }),
      ).to.eq(true);
    });
  });
});
