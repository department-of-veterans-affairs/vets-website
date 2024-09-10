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
    report674: true,
  },
  studentInformation: [
    {
      fullName: {
        first: 'My',
        last: 'Student',
      },
    },
    {
      fullName: {
        first: 'Dan',
        last: 'Cummins',
      },
    },
  ],
};

describe('674 Add students: Student information (ssn)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformation;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('My Student’s information');
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('should render alternate possessive title', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Dan Cummins’ information');
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Student information (address)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartTwo;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('My Student’s address');
    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-select', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(6);
  });

  it('should render alternate possessive title', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Dan Cummins’ address');
    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-select', container).length).to.equal(1);
    expect($$('va-text-input', container).length).to.equal(6);
  });
});

describe('674 Add students: Student information (marital status)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartThree;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('My Student’s marital status');
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('should render alternate possessive title', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Dan Cummins’ marital status');
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Student information (education benefits)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartFour;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('My Student’s education benefits');
    expect($$('va-checkbox', container).length).to.equal(4);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
    expect($$('va-additional-info', container).length).to.equal(1);
  });

  it('should render alternate possessive title', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Dan Cummins’ education benefits');
    expect($$('va-checkbox', container).length).to.equal(4);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
    expect($$('va-additional-info', container).length).to.equal(1);
  });

  it('should render date field if any benefit is selected', () => {
    const studentInformation = [
      {
        fullName: {
          first: 'My',
          last: 'Student',
        },
        typeOfProgramOrBenefit: {
          ch35: true,
        },
      },
    ];

    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{ ...formData, studentInformation }}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('My Student’s education benefits');
    expect($$('va-checkbox', container).length).to.equal(4);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
    expect($$('va-additional-info', container).length).to.equal(1);
    expect($$('va-memorable-date', container).length).to.equal(1);
  });
});

describe('674 Add students: Student information (program or school)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartFive;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('My Student’s education program or school');
    expect($$('va-text-input', container).length).to.equal(1);
  });

  it('should render alternate possessive title', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Dan Cummins’ education program or school');
    expect($$('va-text-input', container).length).to.equal(1);
  });
});

describe('674 Add students: Student information (additional info)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartSix;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Additional information for My Student');
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('should render date field if not full time student', () => {
    const studentInformation = [
      {
        fullName: {
          first: 'My',
          last: 'Student',
        },
        schoolInformation: {
          studentIsEnrolledFullTime: false,
        },
      },
    ];

    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{ ...formData, studentInformation }}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Additional information for My Student');
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
    expect($$('va-memorable-date', container).length).to.equal(1);
  });
});

describe('674 Add students: Student information (is school accredited)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartSeven;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Additional information for My Student');
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Student information (term dates)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartEight;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('My Student’s term dates');
    expect($$('va-additional-info', container).length).to.equal(1);
    expect($$('va-memorable-date', container).length).to.equal(3);
  });

  it('should render alternate possessive title', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Dan Cummins’ term dates');
    expect($$('va-additional-info', container).length).to.equal(1);
    expect($$('va-memorable-date', container).length).to.equal(3);
  });
});

describe('674 Add students: Student information (attended last term)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartNine;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('My Student’s previous term');
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('should render alternate possessive title', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Dan Cummins’ previous term');
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
  });
});

describe('674 Add students: Student information (income during school year)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartTen;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal(
      'My Student’s income in the year their current school term began',
    );
    expect($$('va-text-input', container).length).to.equal(4);
  });

  it('should render alternate possessive title', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal(
      'Dan Cummins’ income in the year their current school term began',
    );
    expect($$('va-text-input', container).length).to.equal(4);
  });
});

describe('674 Add students: Student information (income during next school year)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartEleven;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('My Student’s expected income next year');
    expect($$('va-text-input', container).length).to.equal(4);
  });

  it('should render alternate possessive title', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Dan Cummins’ expected income next year');
    expect($$('va-text-input', container).length).to.equal(4);
  });
});

describe('674 Add students: Student information (assets)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartTwelve;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('My Student’s assets');
    expect($$('va-text-input', container).length).to.equal(5);
  });

  it('should render alternate possessive title', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={1}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Dan Cummins’ assets');
    expect($$('va-text-input', container).length).to.equal(5);
  });
});

describe('674 Add students: Student information (assets)', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.report674.pages.studentAdditionalInformationPartThirteen;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    const h3 = container.querySelector('h3');

    expect(h3).to.not.be.null;
    expect(h3.textContent).to.equal('Additional information');
    expect($$('va-textarea', container).length).to.equal(1);
  });
});
