import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { ReviewField } from '../../../../config/chapters/02-veteran-information/burialInformation';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

describe('Burial Information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.burialInformation;

  it('should render', () => {
    const { container } = render(
      <Provider
        store={{
          ...defaultStore,
          formData: { submission: { timestamp: new Date().toISOString() } },
        }}
      >
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(2);
  });

  describe('date validation', () => {
    const deathDateEvent = { target: { value: '2020-01-01' } };

    it('displays error if Burial date is before Veterans date of death', async () => {
      const { container } = render(
        <Provider store={defaultStore}>
          <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            uiSchema={uiSchema}
            data={{}}
          />
        </Provider>,
      );

      const [deathDateInput, burialDateInput] = $$(
        'va-memorable-date',
        container,
      );

      const burialDateEvent = { target: { value: '2019-01-01' } };

      deathDateInput.__events.dateChange(deathDateEvent);
      burialDateInput.__events.dateChange(burialDateEvent);
      burialDateInput.__events.dateBlur(burialDateEvent);

      await waitFor(() => {
        expect(burialDateInput.error).to.eql(
          'Burial date must be on or after the Veterans date of death',
        );
      });
    });

    it('does not display error if Burial date is after Veterans date of death', async () => {
      const { container } = render(
        <Provider store={defaultStore}>
          <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            uiSchema={uiSchema}
            data={{}}
          />
        </Provider>,
      );

      const [deathDateInput, burialDateInput] = $$(
        'va-memorable-date',
        container,
      );

      const burialDateEvent = { target: { value: '2020-01-29' } };

      deathDateInput.__events.dateChange(deathDateEvent);
      burialDateInput.__events.dateChange(burialDateEvent);
      burialDateInput.__events.dateBlur(burialDateEvent);

      await waitFor(() => {
        expect(burialDateInput.error).to.be.null;
      });
    });

    it('does not display error if Burial date and Veterans date of death are the same', async () => {
      const { container } = render(
        <Provider store={defaultStore}>
          <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            uiSchema={uiSchema}
            data={{}}
          />
        </Provider>,
      );

      const [deathDateInput, burialDateInput] = $$(
        'va-memorable-date',
        container,
      );

      const burialDateEvent = { target: { value: '2020-01-01' } };

      deathDateInput.__events.dateChange(deathDateEvent);
      burialDateInput.__events.dateChange(burialDateEvent);
      burialDateInput.__events.dateBlur(burialDateEvent);

      await waitFor(() => {
        expect(burialDateInput.error).to.be.null;
      });
    });
  });
});

describe('ReviewField', () => {
  it('displays date of burial date if it exists', () => {
    const children = {
      props: {
        formData: '2020-01-01',
      },
    };
    const { queryByText } = render(<ReviewField>{children}</ReviewField>);
    expect(queryByText('Date of burial')).to.exist;
    expect(queryByText('January 1, 2020')).to.exist;
  });
  it('does not display burial date if missing', () => {
    const children = { props: {} };
    const { queryByText } = render(<ReviewField>{children}</ReviewField>);
    expect(queryByText('Date of burial')).to.exist;
    expect(queryByText('January 1 2020')).to.be.null;
  });
});
