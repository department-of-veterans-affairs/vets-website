import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import EditLink from '../../../components/EditLink';

describe('EditLink', () => {
  const URL = 'https://dev.va.org/link';
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const subject = () =>
    render(
      <MemoryRouter initialEntries={['/']}>
        <EditLink href={URL} router={history} />
      </MemoryRouter>,
    );

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });

  it('renders the correct label', () => {
    const { container } = subject();
    const link = $('va-link', container);
    expect(link).to.exist;
    expect(link).to.have.attr('text', 'Edit');
  });

  it('navigates on click', () => {
    const pushSpy = sinon.spy(history, 'push');
    const { container } = subject();
    const link = container.querySelector('va-link');

    userEvent.click(link);

    expect(pushSpy.calledOnce).to.be.true;
    expect(pushSpy.firstCall.args[0]).to.equal(URL);

    pushSpy.restore();
  });
});
