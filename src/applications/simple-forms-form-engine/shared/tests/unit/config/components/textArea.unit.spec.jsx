import { expect } from 'chai';
import textArea from 'applications/simple-forms-form-engine/shared/config/components/textArea';
import * as textPatterns from 'platform/forms-system/src/js/web-component-patterns/textPatterns';
import sinon from 'sinon';

describe('textArea', () => {
  const component = {
    hint: 'This is optional hint text',
    id: '172747',
    label: 'Custom text area',
    required: false,
    type: 'digital_form_text_area',
  };

  it('is a tuple', () => {
    const schemas = textArea(component);
    expect(schemas.length).to.eq(2);
  });

  describe('schema', () => {
    const [schema] = textArea(component);
    it('contains the correct type', () => {
      expect(schema.type).to.eq('string');
    });
  });

  describe('uiSchema', () => {
    beforeEach(() => {
      sinon.spy(textPatterns, 'textareaUI');
    });

    afterEach(() => {
      textPatterns.textareaUI.restore();
    });

    it('calls the correct UI function', () => {
      textArea(component);

      expect(
        textPatterns.textareaUI.calledWithMatch({
          title: component.label,
          hint: component.hint,
        }),
      ).to.eq(true);
    });
  });
});
