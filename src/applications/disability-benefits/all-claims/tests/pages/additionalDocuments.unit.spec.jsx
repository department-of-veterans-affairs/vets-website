import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import moment from 'moment';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import {
  DefinitionTester, // selectCheckbox
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { createStore } from 'redux';
import { render } from '@testing-library/react';
import formConfig from '../../config/form';
import { SAVED_SEPARATION_DATE } from '../../constants';
import { selfAssessmentHeadline } from '../../content/selfAssessmentAlert';

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

  it('should render', () => {
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

  it('should not submit without an upload', () => {
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

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.equal(false);
    form.unmount();
  });

  it('should not submit without required info', () => {
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

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.equal(false);
    form.unmount();
  });

  it('should submit with valid data', () => {
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

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.equal(true);
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
    sessionStorage.setItem(
      SAVED_SEPARATION_DATE,
      moment()
        .add(90, 'days')
        .format('YYYY-MM-DD'),
    );

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
});
