import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../../config/form';
import marriageHistory from '../../../../config/chapters/04-household-information/marriageHistory';
import { testNumberOfFieldsByType } from '../pageTests.spec';

const { schema, uiSchema } = marriageHistory;
const definitions = formConfig.defaultDefinitions;
const {
  arrayPath,
  title,
} = formConfig.chapters.householdInformation.pages.marriageHistory;

const marriagesData = {
  maritalStatus: 'MARRIED',
  marriages: [{}, {}],
};

describe('Pensions marriage history', async () => {
  it('should render all fields for a previous marriage', () => {
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={definitions}
        schema={schema}
        data={marriagesData}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(5);
    expect($$('va-select', container).length).to.equal(0);
    expect($$('va-radio', container).length).to.equal(1);
    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should render all fields for current marriage', () => {
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={1}
        definitions={definitions}
        schema={schema}
        data={marriagesData}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(4);
    expect($$('va-select', container).length).to.equal(0);
    expect($$('va-radio', container).length).to.equal(1);
    expect($('button[type="submit"]', container)).to.exist;
  });

  describe('hideIf current marriage', () => {
    const hideIfCurrentMarriage =
      marriageHistory.uiSchema.marriages.items['view:pastMarriage'][
        'ui:options'
      ].hideIf;

    it('hides if married and last', () => {
      const result = hideIfCurrentMarriage(
        {
          maritalStatus: 'MARRIED',
          marriages: [{}],
        },
        0,
      );

      expect(result).to.be.true;
    });

    it('does not hide if married and not last', () => {
      const result = hideIfCurrentMarriage(
        {
          maritalStatus: 'MARRIED',
          marriages: [{}, {}],
        },
        0,
      );

      expect(result).to.be.false;
    });

    it('does not hide if not married', () => {
      const result = hideIfCurrentMarriage(
        {
          marriages: [{}],
        },
        0,
      );

      expect(result).to.be.false;
    });
  });

  describe('dynamic page titles', () => {
    it('uses word for index', () => {
      expect(title({}, { pagePerItemIndex: 0 })).to.equal('First marriage');
    });
    it('uses number when at index ten or greater', () => {
      expect(title({}, { pagePerItemIndex: 10 })).to.equal('Eleventh marriage');
    });
    it('uses word for index', () => {
      expect(title({}, { pagePerItemIndex: 49 })).to.equal('50th marriage');
    });
    it('uses word for index', () => {
      expect(title({})).to.equal('First marriage');
    });
  });

  it('should not submit empty form on previous marriages', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={definitions}
        schema={schema}
        data={marriagesData}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      const errors = '.usa-input-error, va-select[error], va-text-input[error]';
      expect($$(errors, container).length).to.equal(6);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should not submit empty form on current marriage', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={1}
        definitions={definitions}
        schema={schema}
        data={marriagesData}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      const errors = '.usa-input-error, va-select[error], va-text-input[error]';
      expect($$(errors, container).length).to.equal(4);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit previous marriage with valid data', async () => {
    marriagesData.marriages[0] = {
      spouseFullName: {
        first: 'Jane',
        last: 'Doe',
      },
      'view:pastMarriage': {
        reasonForSeparation: 'DEATH',
        dateOfMarriage: '2000-01-15',
        dateOfSeparation: '2005-01-15',
        locationOfMarriage: 'Hope',
        locationOfSeparation: 'Pain',
      },
    };

    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={definitions}
        schema={schema}
        data={marriagesData}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(onSubmit.called).to.be.true;
    });
  });

  it('should submit current marriage with valid data', async () => {
    marriagesData.marriages[1] = {
      spouseFullName: {
        first: 'First',
        last: 'Wife',
      },
      'view:currentMarriage': {
        dateOfMarriage: '2015-04-10',
        locationOfMarriage: 'Admiration',
        marriageType: 'CEREMONY',
      },
    };

    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={1}
        definitions={definitions}
        schema={schema}
        data={marriagesData}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(onSubmit.called).to.be.true;
    });
  });

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 5,
      'va-radio': 1,
      input: 2,
    },
    'marriage history',
    marriagesData,
    {
      arrayPath,
      pagePerItemIndex: 0,
    },
  );
});
