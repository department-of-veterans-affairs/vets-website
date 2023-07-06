import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CancelDependentActionDescription from '../../../components/FormDescriptions/CancelDependentActionDescription';

describe('hca <CancelDependentActionDescription>', () => {
  const defaultSelector = '[data-testid="cancel-action-description"]';

  it('should render', () => {
    const view = render(
      <CancelDependentActionDescription formData={{}} mode="add" />,
    );
    const selector = view.container.querySelector(defaultSelector);
    expect(selector).to.exist;
  });

  it('should render generic message in `add` mode with no form data', () => {
    const view = render(
      <CancelDependentActionDescription formData={{}} mode="add" />,
    );
    const selector = view.container.querySelector(defaultSelector);
    expect(selector).to.contain.text(
      'This will stop adding the dependent. You’ll return to a list of any previously added dependents and this dependent will not be added.',
    );
  });

  it('should render specific message with dependent name in `edit` mode', () => {
    const fullName = { first: 'John', last: 'Smith' };
    const view = render(
      <CancelDependentActionDescription formData={{ fullName }} mode="edit" />,
    );
    const selector = view.container.querySelector(defaultSelector);
    expect(selector).to.contain.text(
      'This will stop editing John Smith. You will return to a list of any previously added dependents and your edits will not be applied.',
    );
  });

  it('should render specific message with dependent name in `update` mode', () => {
    const fullName = { first: 'John', last: 'Smith', suffix: 'II' };
    const view = render(
      <CancelDependentActionDescription
        formData={{ fullName }}
        mode="update"
      />,
    );
    const selector = view.container.querySelector(defaultSelector);
    expect(selector).to.contain.text(
      'This will stop editing John Smith II. You will return to a list of any previously added dependents and your edits will not be applied.',
    );
  });
});
