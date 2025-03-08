import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import FormSignatureCheckbox from '../../components/FormSignatureCheckbox';

describe('<FormSignatureCheckbox />', () => {
  it('should render with empty props', () => {
    const { container } = render(
      <div>
        <FormSignatureCheckbox />
      </div>,
    );

    expect($('va-checkbox', container)).to.exist;
  });
  it('should render with props', () => {
    const setChecked = sinon.spy();
    const { container } = render(
      <div>
        <FormSignatureCheckbox
          required={false}
          checked={false}
          setChecked={setChecked}
          checkboxDescription="I certify the information above is correct and true to the best of my knowledge and belief."
          showError
        />
      </div>,
    );

    expect($('va-checkbox', container)).to.exist;
  });
  it('should call setChecked when clicked', () => {
    const setChecked = sinon.spy();
    const { container } = render(
      <div>
        <FormSignatureCheckbox checked={false} setChecked={setChecked} />
      </div>,
    );

    $('va-checkbox', container).__events.vaChange({
      target: { checked: true },
    });

    expect(setChecked.calledOnce).to.be.true;
  });
});
