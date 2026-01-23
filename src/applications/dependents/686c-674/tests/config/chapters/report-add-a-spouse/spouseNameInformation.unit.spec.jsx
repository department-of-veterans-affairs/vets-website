import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';
import { SpouseEvidencePreparation } from '../../../../components/SpouseEvidencePreparation';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addSpouse: true,
  },
};

const noSsnFormData = {
  'view:selectable686Options': {
    addSpouse: true,
  },
  spouseInformation: {
    noSsn: true,
    noSsnReason: 'NONRESIDENT_ALIEN',
  },
  vaDependentsNoSsn: true,
};

describe('686 current marriage information: Spouse personal information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.spouseNameInformation;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );
    expect($$('va-text-input', container).length).to.equal(4);
    expect($$('va-memorable-date', container).length).to.equal(1);
  });
});

describe('686 current marriage information: Spouse personal information no SSN', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.spouseNameInformation;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={noSsnFormData}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(3);
    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('686 current marriage information: Spouse is a Veteran', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.spouseNameInformationPartTwo;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('686 current marriage information: Spouse military service information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.spouseNameInformationPartThree;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(2);
  });
});

describe('686 current marriage information: helpers', () => {
  const store = {
    getState: () => ({
      form: {
        data: {
          currentMarriageInformation: {
            type: 'PROXY',
          },
        },
      },
    }),
    dispatch: () => {},
    subscribe: () => {},
  };
  const container = render(
    <Provider store={store}>
      <SpouseEvidencePreparation />
    </Provider>,
  );

  expect(
    container.queryByText(
      'Based on your answers, you’ll need to submit supporting evidence to add your spouse as your dependent.',
    ),
  ).to.not.be.null;
});
