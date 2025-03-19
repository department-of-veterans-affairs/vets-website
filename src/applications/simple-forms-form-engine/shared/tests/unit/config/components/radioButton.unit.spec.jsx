import { expect } from 'chai';
import radioButton from 'applications/simple-forms-form-engine/shared/config/components/radioButton';
import * as radioPattern from 'platform/forms-system/src/js/web-component-patterns/radioPattern';
import sinon from 'sinon';

describe('radioButton', () => {
  const component = {
    hint: 'This radio component has two options.',
    id: '172742',
    label: 'Test radio component',
    required: false,
    type: 'digital_form_radio_button',
    responseOptions: [
      {
        id: '172743',
        label: 'My custom option',
        description: 'This option has optional description text.',
      },
      {
        id: '172744',
        label: 'A second option',
        description: null,
      },
    ],
  };

  it('is a tuple', () => {
    const schemas = radioButton(component);
    expect(schemas.length).to.eq(2);
  });

  describe('schema', () => {
    beforeEach(() => {
      sinon.spy(radioPattern, 'radioSchema');
    });

    afterEach(() => {
      radioPattern.radioSchema.restore();
    });

    it('calls the schema function with the correct args', () => {
      radioButton(component);

      expect(
        radioPattern.radioSchema.calledWithMatch([
          'myCustomOption',
          'aSecondOption',
        ]),
      ).to.eq(true);
    });
  });

  describe('uiSchema', () => {
    beforeEach(() => {
      sinon.spy(radioPattern, 'radioUI');
    });

    afterEach(() => {
      radioPattern.radioUI.restore();
    });

    it('calls the correct UI function', () => {
      radioButton(component);

      expect(
        radioPattern.radioUI.calledWithMatch({
          title: component.label,
          hint: component.hint,
          labels: {
            myCustomOption: component.responseOptions[0].label,
            aSecondOption: component.responseOptions[1].label,
          },
          descriptions: {
            myCustomOption: component.responseOptions[0].description,
            aSecondOption: component.responseOptions[1].description,
          },
          tile: true,
        }),
      ).to.eq(true);
    });
  });
});
