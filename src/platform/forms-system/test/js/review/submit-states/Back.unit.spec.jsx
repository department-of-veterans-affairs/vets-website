import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import Back from '../../../../src/js/review/submit-states/Back';

describe('Schemaform review: <Back />', () => {
  it('has an enabled back button', () => {
    const onBack = sinon.spy();
    const { container } = render(<Back onButtonClick={onBack} />);

    const button = $('button', container);
    fireEvent.click(button);

    expect(onBack.called).to.be.true;
    expect(button.textContent).to.equal('Back');
    expect(button.disabled).to.be.false;
    expect($('va-icon', container)).to.exist;
    expect(button.className).to.equal('usa-button-secondary');
  });

  it('renders a va-button', () => {
    const onBack = sinon.spy();
    const { container } = render(
      <Back onButtonClick={onBack} useWebComponents />,
    );
    const button = $('va-button', container);
    fireEvent.click(button);

    expect(onBack.called).to.be.true;
    expect(button.getAttribute('text')).to.equal('Back');
    expect(button.getAttribute('disabled')).to.be.null;
    expect(button.getAttribute('class')).to.equal('');
    expect(button.getAttribute('secondary')).to.equal('true');
  });
});
