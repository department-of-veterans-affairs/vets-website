import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import ArrivedAtFacility from '../ArrivedAtFacility';
import { recordAnswer } from '../../../actions/universal';
import { recordAnswerHandler } from '../../../reducers/pre-check-in';

describe('ArrivedAtFacility', () => {
  it('should dispatch "yes" answer and go to next page when "Yes" button is clicked', () => {
    const push = sinon.spy();

    const component = render(
      <CheckInProvider router={{ push }}>
        <ArrivedAtFacility />
      </CheckInProvider>,
    );

    const yesButton = component.getByTestId('yes-button');
    expect(yesButton).to.exist;
    yesButton.click();

    const action = recordAnswer({ answer: 'yes' });
    const state = recordAnswerHandler({ form: {} }, action);
    expect(state.form.data.answer).to.equal('yes');
    expect(push.calledOnce).to.be.true;
  });

  it('should dispatch "no" answer and go to next page when "No" button is clicked', () => {
    const push = sinon.spy();

    const component = render(
      <CheckInProvider router={{ push }}>
        <ArrivedAtFacility />
      </CheckInProvider>,
    );

    const noButton = component.getByTestId('no-button');

    expect(noButton).to.exist;
    noButton.click();

    const action = recordAnswer({ answer: 'no' });
    const state = recordAnswerHandler({ form: {} }, action);
    expect(state.form.data.answer).to.equal('no');
    expect(push.calledOnce).to.be.true;
  });
});
