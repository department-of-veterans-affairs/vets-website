import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';
import { selfAssessmentHeadline } from '../../content/selfAssessmentAlert';
import * as utils from '../../utils';

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

const getDocumentDataWithDisability526NewBddShaEnforcementWorkflowEnabledFlagSet = featureFlagValue => ({
  ...validDocumentData,
  disability526NewBddShaEnforcementWorkflowEnabled: featureFlagValue,
});

describe('526EZ document upload', () => {
  const page = formConfig.chapters.supportingEvidence.pages.additionalDocuments;
  const { schema, uiSchema, arrayPath } = page;

  let sandbox;

  /**
   * Utility for reducing the noise in tests and highlighting only the important signals of the test.
   *
   * @param {*} props - Overrides to the default value of DefinitionTester. Primarily used to pass the data prop.
   * @returns {JSX.Element} The rendered DefinitionTester component.
   */
  const DefaultDefinitionTester = props => {
    return (
      <Provider store={uploadStore}>
        <DefinitionTester
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          {...props}
        />
      </Provider>
    );
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

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

  describe('Separation Health Assessment Alert', () => {
    const configureMocksAndGetData = ({
      isBddReturn,
      bddShaEnforcementWorkflowFlagReturn,
    }) => {
      sandbox.stub(utils, 'isBDD').returns(isBddReturn);
      return getDocumentDataWithDisability526NewBddShaEnforcementWorkflowEnabledFlagSet(
        bddShaEnforcementWorkflowFlagReturn,
      );
    };

    it('should not display if submission is not considered BDD and new BDD SHA enforcement workflow is not enabled', () => {
      const data = configureMocksAndGetData({
        isBddReturn: false,
        bddShaEnforcementWorkflowFlagReturn: false,
      });

      const { queryByText } = render(<DefaultDefinitionTester data={data} />);

      expect(queryByText(selfAssessmentHeadline)).to.not.exist;
    });

    it('should not display if submission is not considered BDD but new BDD SHA enforcement workflow is enabled', () => {
      const data = configureMocksAndGetData({
        isBddReturn: false,
        bddShaEnforcementWorkflowFlagReturn: true,
      });

      const { queryByText } = render(<DefaultDefinitionTester data={data} />);

      expect(queryByText(selfAssessmentHeadline)).to.not.exist;
    });

    it('should display when submission is considered BDD and new BDD SHA enforcement workflow is not enabled', () => {
      const data = configureMocksAndGetData({
        isBddReturn: true,
        bddShaEnforcementWorkflowFlagReturn: false,
      });

      const { queryByText } = render(<DefaultDefinitionTester data={data} />);

      expect(queryByText(selfAssessmentHeadline)).to.exist;
    });

    it('should not display alert when submission is considered BDD but new BDD SHA enforcement workflow is enabled', () => {
      const data = configureMocksAndGetData({
        isBddReturn: true,
        bddShaEnforcementWorkflowFlagReturn: true,
      });

      const { queryByText } = render(<DefaultDefinitionTester data={data} />);

      expect(queryByText(selfAssessmentHeadline)).to.not.exist;
    });
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
