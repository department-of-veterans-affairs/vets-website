import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import lawLicensePage from '../../../../pages/01-personal-information-chapter/lawLicense';

describe('Law license page', () => {
  it('renders the law license question and yes/no options', () => {
    const { container } = render(
      <SchemaForm
        name="lawLicense"
        title={lawLicensePage.title}
        schema={lawLicensePage.schema}
        uiSchema={lawLicensePage.uiSchema}
        data={{}}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'Are you currently an active member in good standing of the bar of the highest court of a state or territory of the United States?',
    );

    const options = container.querySelectorAll('va-radio-option');
    expect(options.length).to.equal(2);
    expect(options[0].getAttribute('label')).to.equal('Yes');
    expect(options[1].getAttribute('label')).to.equal('No');
  });
});
