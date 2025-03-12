import { expect } from 'chai';
import sinon from 'sinon';
import * as titlePattern from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import * as textArea from 'applications/simple-forms-form-engine/shared/config/components/textArea';
import * as textInput from 'applications/simple-forms-form-engine/shared/config/components/textInput';
import customStepPage from 'applications/simple-forms-form-engine/shared/config/pages/customStepPage';

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

    context('when component is a date component', () => {
      it('calls the correct function');
    });

    context('when component is a radio button', () => {
      it('calls the correct function');
    });

    context('when component is a checkbox', () => {
      it('calls the correct function');
    });
  });
});
