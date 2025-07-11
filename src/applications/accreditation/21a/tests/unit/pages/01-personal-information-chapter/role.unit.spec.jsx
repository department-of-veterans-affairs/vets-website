import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import rolePage from '../../../../pages/01-personal-information-chapter/role';

describe('Role page', () => {
  it('renders the role question, description, and options', () => {
    const { container, getByText } = render(
      <SchemaForm
        name="role"
        title={rolePage.title}
        schema={rolePage.schema}
        uiSchema={rolePage.uiSchema}
        data={{}}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'Which role are you applying for?',
    );

    expect(
      getByText(
        /To be accredited as an attorney, you must be active and in good standing with a state bar. To be accredited as a claims agent, you must pass a written examination administered by VA./,
        { exact: false },
      ),
    ).to.exist;

    const options = container.querySelectorAll('va-radio-option');
    expect(options.length).to.equal(2);
    expect(options[0].getAttribute('label')).to.equal('Attorney');
    expect(options[1].getAttribute('label')).to.equal(
      'Claims agent (non-attorney representative)',
    );
  });
});
