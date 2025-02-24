import { expect } from 'chai';
import sinon from 'sinon';
import * as titlePattern from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import customStepPage from 'applications/simple-forms-form-engine/shared/config/pages/customStepPage';

describe('customStepPage', () => {
  const normalizedPage = {
    bodyText: 'My custom body text',
    components: [
      {
        hint: 'This is optional hint text',
        label: 'My custom text input',
        required: true,
        type: 'digital_form_text_input',
      },
      {
        hint: 'This text input is not required',
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

  it('creates a schema and uiSchema key for every component', () => {
    const pageSchema = customStepPage(normalizedPage);
    const schemaKeys = Object.keys(pageSchema.schema.properties);
    const uiSchemaKeys = Object.keys(pageSchema.uiSchema);

    expect(schemaKeys.length).to.eq(normalizedPage.components.length);

    [schemaKeys, uiSchemaKeys].forEach(keys => {
      expect(keys).to.include('myCustomTextInput', 'anOptionalTextInput');
    });
  });

  it('requires all required components', () => {
    const pageSchema = customStepPage(normalizedPage);
    const { required } = pageSchema.schema;

    expect(required.length).to.eq(1);
    expect(required[0]).to.eq('myCustomTextInput');
  });

  context('when component is a text input', () => {
    it('calls the correct function');
  });
});
