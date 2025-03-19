import { expect } from 'chai';
import sinon from 'sinon';
import * as titlePattern from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import customStepPage from 'applications/simple-forms-form-engine/shared/config/pages/customStepPage';
import * as textArea from 'applications/simple-forms-form-engine/shared/config/components/textArea';
import * as textInput from 'applications/simple-forms-form-engine/shared/config/components/textInput';
import * as date from 'applications/simple-forms-form-engine/shared/config/components/date';
import * as radioButton from 'applications/simple-forms-form-engine/shared/config/components/radioButton';
import * as checkbox from 'applications/simple-forms-form-engine/shared/config/components/checkbox';

describe('customStepPage', () => {
  const normalizedPage = {
    bodyText: 'My custom body text',
    components: [
      {
        hint: 'This is optional hint text',
        id: '12345',
        label: 'My custom text input',
        required: true,
        type: 'digital_form_text_input',
      },
      {
        hint: 'This text input is not required',
        id: '54321',
        label: 'An optional text input',
        required: false,
        type: 'digital_form_text_input',
      },
    ],
    pageTitle: 'My custom page',
  };

  beforeEach(() => {
    sinon.spy(titlePattern, 'titleUI');
  });

  afterEach(() => {
    titlePattern.titleUI.restore();
  });

  it('includes the correct attributes', () => {
    const pageSchema = customStepPage(normalizedPage);

    expect(pageSchema.title).to.eq(normalizedPage.pageTitle);
    expect(pageSchema.path).to.eq('my-custom-page');
  });

  it('calls titleUI with the correct args', () => {
    customStepPage(normalizedPage);

    expect(
      titlePattern.titleUI.calledWith(
        normalizedPage.pageTitle,
        normalizedPage.bodyText,
      ),
    ).to.eq(true);
  });

  it('uses IDs for schema and uiSchema keys', () => {
    const componentIds = normalizedPage.components.map(
      component => `component${component.id}`,
    );
    const pageSchema = customStepPage(normalizedPage);
    const schemaKeys = Object.keys(pageSchema.schema.properties);
    const uiSchemaKeys = Object.keys(pageSchema.uiSchema);

    expect(schemaKeys.length).to.eq(normalizedPage.components.length);

    [schemaKeys, uiSchemaKeys].forEach(keys => {
      expect(keys).to.include(...componentIds);
    });
  });

  it('requires all required components', () => {
    const pageSchema = customStepPage(normalizedPage);
    const { required } = pageSchema.schema;

    expect(required.length).to.eq(1);
    expect(required[0]).to.eq(`component${normalizedPage.components[0].id}`);
  });

  describe('selectSchemas', () => {
    let spy;

    afterEach(() => {
      spy.restore();
    });

    [
      {
        importedFunction: checkbox,
        component: {
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
        },
      },
      {
        importedFunction: date,
        component: {
          hint:
            'This date component includes the day as well as the month and the year.',
          id: '172748',
          label: 'Date with Day',
          required: true,
          type: 'digital_form_date_component',
          dateFormat: 'month_day_year',
        },
      },
      {
        importedFunction: radioButton,
        component: {
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
        },
      },
      {
        importedFunction: textArea,
        component: {
          hint: 'This is optional hint text',
          id: '172747',
          label: 'Custom text area',
          required: false,
          type: 'digital_form_text_area',
        },
      },
      {
        importedFunction: textInput,
        component: {
          hint: 'This is optional hint text',
          id: '172748',
          label: 'Custom text input',
          required: true,
          type: 'digital_form_text_input',
        },
      },
    ].forEach(({ importedFunction, component }) => {
      context(`when component type is ${component.type}`, () => {
        beforeEach(() => {
          spy = sinon.spy(importedFunction, 'default');

          normalizedPage.components = [...normalizedPage.components, component];
        });

        it('calls the correct function', () => {
          customStepPage(normalizedPage);

          expect(spy.calledWithMatch(component)).to.eq(true);
        });
      });
    });
  });
});
