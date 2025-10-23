import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import primaryMailingAddressPage from '../../../../pages/01-personal-information-chapter/primaryMailingAddress';

describe('Primary mailing address page', () => {
  it('renders the title, question, and all radio options', () => {
    const { container, getByText } = render(
      <SchemaForm
        name="primaryMailingAddress"
        title={primaryMailingAddressPage.title}
        schema={primaryMailingAddressPage.schema}
        uiSchema={primaryMailingAddressPage.uiSchema}
        data={{ primaryMailingAddress: 'HOME' }}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(getByText('Primary mailing address')).to.exist;

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'What address would you like to receive communication from the Office of General Counsel (OGC)?',
    );

    const html = container.innerHTML;
    expect(html).to.include('Home');
    expect(html).to.include('Work');
    expect(html).to.include('Other');
  });
});
