import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addSpouse: true,
  },
};

describe('686 current spouse information: Current marriage information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.currentMarriageInformation;

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

    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(1);
    expect($$('va-select', container).length).to.equal(1);
  });

  // it('should disable state field if married outside the U.S.', () => {
  //   const { container } = render(
  //     <Provider store={defaultStore}>
  //       <DefinitionTester
  //         schema={schema}
  //         definitions={formConfig.defaultDefinitions}
  //         uiSchema={uiSchema}
  //         data={{
  //           ...formData,
  //           currentMarriageInformation: {
  //             outsideUsa: true,
  //           },
  //         }}
  //       />
  //     </Provider>,
  //   );

  //   const vaSelectElement = $$('va-select', container)[0]; // Assuming there's only one va-select

  //   screen.debug();
  //   expect($$('va-checkbox', container).length).to.equal(1);
  //   expect($$('va-text-input', container).length).to.equal(1);
  //   expect($$('va-select', container).length).to.equal(1);
  //   expect(vaSelectElement).to.exist;
  //   expect(vaSelectElement.hasAttribute('required')).to.be.false;
  // });
});

describe('686 current spouse information: How did you get married', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.currentMarriageInformationPartTwo;

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
    expect($$('va-radio-option', container).length).to.equal(6);
  });

  it('should render other text field', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            ...formData,
            currentMarriageInformation: {
              type: 'OTHER',
            },
          }}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(6);
    expect($$('va-text-input', container).length).to.equal(1);
  });
});

describe('686 current spouse information: Spouse’s address', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.currentMarriageInformationPartThree;

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

    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-select', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(6);
  });
});

describe('686 current spouse information: Reason you live separately from your spouse', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.currentMarriageInformationPartFour;

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
    expect($$('va-radio-option', container).length).to.equal(4);
  });

  it('should render other text field', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            ...formData,
            doesLiveWithSpouse: {
              currentSpouseReasonForSeparation: 'OTHER',
            },
          }}
        />
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(4);
    expect($$('va-text-input', container).length).to.equal(1);
  });
});
