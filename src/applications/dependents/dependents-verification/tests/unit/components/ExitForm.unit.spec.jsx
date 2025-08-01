import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { VA_FORM_IDS } from 'platform/forms/constants';
import * as utils from '../../../util';
import { form686Url, ExitForm } from '../../../components/ExitForm';

describe('ExitForm', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should render the exit form with correct title and subtitle', () => {
    const { container } = render(<ExitForm />);

    expect($('h1', container).textContent).to.include(
      'Update your dependents in a different form',
    );
    expect($('.schemaform-subtitle', container).textContent).to.include(
      'VA Forms 21-686c and 21-674',
    );
    expect($('va-button[back]', container)).to.exist;
    expect($('va-button[continue]', container).getAttribute('text')).to.eq(
      'Go to add or remove dependents form',
    );
  });

  it('should push url to router when back button is clicked', async () => {
    const router = { push: sinon.spy() };
    const { container } = render(<ExitForm router={router} />);

    fireEvent.click($('va-button[back]', container));
    await expect(router.push.calledWith('/dependents')).to.be.true;
  });

  it('should call redirect to 686c-674 when Go to button is clicked', async () => {
    const deleteInProgressFormStub = sinon
      .stub(utils, 'deleteInProgressForm')
      .resolves();
    const { container } = render(<ExitForm />);
    const assignSpy = sinon.spy();
    global.window = window;
    global.window.location = { assign: assignSpy };

    fireEvent.click($('va-button[continue]', container));

    await waitFor(() => {
      expect(deleteInProgressFormStub.calledWith(VA_FORM_IDS.FORM_21_0538)).to
        .be.true;
      expect(assignSpy.calledWith(form686Url)).to.be.true;
    });
  });
});
