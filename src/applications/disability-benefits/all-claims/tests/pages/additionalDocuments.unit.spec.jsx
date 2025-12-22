import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { createStore } from 'redux';
import { render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';
import { SAVED_SEPARATION_DATE } from '../../constants';
import { selfAssessmentHeadline } from '../../content/selfAssessmentAlert';
import { daysFromToday } from '../../utils/dates/formatting';

const invalidDocumentData = {
  additionalDocuments: [
    {
      confirmationCode: 'testing',
      name: 'someFile.pdf',
    },
  ],
};

const validDocumentData = {
  additionalDocuments: [
    {
      name: 'Form526.pdf',
      confirmationCode: 'testing',
      attachmentId: 'L015',
    },
  ],
};

describe('526EZ document upload', () => {
  const page = formConfig.chapters.supportingEvidence.pages.additionalDocuments;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', async () => {
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(form.find('input').length).to.equal(1);
    form.unmount();
  });

  it('should not submit without an upload', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          onSubmit={onSubmit}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');

      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.equal(false);
    });
    form.unmount();
  });

  it('should not submit without required info', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          onSubmit={onSubmit}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={invalidDocumentData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');

      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.equal(false);
    });
    form.unmount();
  });

  it('should submit with valid data', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          onSubmit={onSubmit}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={validDocumentData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.equal(true);
    });
    form.unmount();
  });

  it('should not display alert if not BDD', () => {
    const { queryByText } = render(
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={validDocumentData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(queryByText(selfAssessmentHeadline)).to.not.exist;
  });

  it('should display alert when BDD SHA enabled', () => {
    const fakeStore = createStore(() => ({
      featureToggles: {},
    }));

    // mock BDD
    window.sessionStorage.setItem(SAVED_SEPARATION_DATE, daysFromToday(90));

    const form = render(
      <Provider store={fakeStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={validDocumentData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    form.getByText(
      'Please submit your Separation Health Assessment - Part A Self-Assessment as soon as possible',
    );
  });

  describe('ui:confirmationField', () => {
    it('should correctly display file names and label for confirmation field', () => {
      const testData = validDocumentData.additionalDocuments;
      testData.push({
        name: 'SupportingEvidence.pdf',
        confirmationCode: 'testing2',
        attachmentId: 'L016',
      });

      const result = uiSchema.additionalDocuments['ui:confirmationField']({
        formData: testData,
      });

      expect(result).to.deep.equal({
        data: ['Form526.pdf', 'SupportingEvidence.pdf'],
        label: 'Uploaded file(s)',
      });
    });
  });
});
