import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import TextareaWidget from '../../components/TextareaWidget';

describe('VAOS <TextareaWidget>', () => {
  beforeEach(() => mockFetch());
  it('should render character limit', () => {
    const screen = render(
      <TextareaWidget value="Test" schema={{ maxLength: 20 }} />,
    );

    expect(screen.getByText(/16 characters remaining/i)).to.exist;
    expect(screen.getByRole('textbox')).to.have.attribute('maxlength', '20');
    expect(screen.getByRole('textbox')).to.have.value('Test');
  });

  it('should render over the limit message', () => {
    const screen = render(
      <TextareaWidget value="Test" schema={{ maxLength: 2 }} />,
    );

    expect(screen.getByText(/2 characters over the limit/i)).to.exist;
    expect(screen.getByRole('textbox')).to.have.attribute('maxlength', '2');
    expect(screen.getByRole('textbox')).to.have.value('Test');
  });

  it('should call onChange', () => {
    const onChange = sinon.spy();
    const screen = render(<TextareaWidget onChange={onChange} schema={{}} />);

    userEvent.type(screen.getByRole('textbox'), 'w');
    expect(onChange.calledWith('w')).to.be.true;
  });
});
