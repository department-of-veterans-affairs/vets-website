import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { APP_NAMES } from '../../../utils/appConstants';

import TestComponent from './TestComponent';

describe('check-in', () => {
  describe('useStorage', () => {
    describe('default namespace', () => {
      const removeItem = sinon.spy();
      const window = {
        sessionStorage: {
          removeItem,
        },
      };

      const component = render(
        <TestComponent window={window} app={APP_NAMES.PRE_CHECK_IN} />,
      );
      const button = component.getByTestId('clear-button');
      fireEvent.click(button);

      expect(removeItem.called).to.be.true;
      expect(removeItem.calledWith('health.care.pre.check.in.current.uuid')).to
        .be.true;
    });
    describe('clearCurrentStorage', () => {
      it('should clear the named space session', () => {
        const removeItem = sinon.spy();
        const window = {
          sessionStorage: {
            removeItem,
          },
        };

        const component = render(
          <TestComponent window={window} app={APP_NAMES.PRE_CHECK_IN} />,
        );
        const button = component.getByTestId('clear-button');
        fireEvent.click(button);

        expect(removeItem.called).to.be.true;
        expect(removeItem.calledWith('health.care.pre.check.in.current.uuid'))
          .to.be.true;
      });
    });
    describe('getCurrentToken', () => {
      it('window is null', () => {
        const window = null;

        const component = render(
          <TestComponent window={window} app={APP_NAMES.PRE_CHECK_IN} />,
        );
        const button = component.getByTestId('get-button');
        fireEvent.click(button);
        expect(component.getByTestId('from-session').innerHTML).to.equal('');
      });
      it('calls getItem', () => {
        const getItem = sinon.spy();
        const window = {
          sessionStorage: {
            getItem,
          },
        };

        const component = render(
          <TestComponent window={window} app={APP_NAMES.PRE_CHECK_IN} />,
        );
        const button = component.getByTestId('get-button');
        fireEvent.click(button);

        expect(getItem.called).to.be.true;
        expect(getItem.calledWith('health.care.pre.check.in.current.uuid')).to
          .be.true;
      });
      it('key is not found', () => {
        const window = {
          sessionStorage: {
            getItem: () => null,
          },
        };

        const component = render(
          <TestComponent window={window} app={APP_NAMES.PRE_CHECK_IN} />,
        );
        const button = component.getByTestId('get-button');
        fireEvent.click(button);
        expect(component.getByTestId('from-session').innerHTML).to.be.empty;
      });
      it('key is found', () => {
        const window = {
          sessionStorage: {
            getItem: () => JSON.stringify({ token: 'some-token' }),
          },
        };

        const component = render(
          <TestComponent window={window} app={APP_NAMES.PRE_CHECK_IN} />,
        );
        const button = component.getByTestId('get-button');
        fireEvent.click(button);

        expect(component.getByTestId('from-session').innerHTML).to.equal(
          JSON.stringify({ token: 'some-token' }),
        );
      });
    });
    describe('setCurrentToken', () => {
      it('saves data to name spaced key', () => {
        const setItem = sinon.spy();
        const window = {
          sessionStorage: {
            setItem,
          },
        };
        const testToken = 'testToken';
        const component = render(
          <TestComponent
            window={window}
            token={testToken}
            app={APP_NAMES.PRE_CHECK_IN}
          />,
        );
        const button = component.getByTestId('set-button');
        fireEvent.click(button);
        expect(setItem.called).to.be.true;
        expect(
          setItem.calledWith(
            'health.care.pre.check.in.current.uuid',
            JSON.stringify({ token: testToken }),
          ),
        ).to.be.true;
      });
    });

    describe('getTravelPay from localStorage', () => {
      it('key is not found', () => {
        const window = {
          localStorage: {
            getItem: () => null,
          },
        };

        const component = render(
          <TestComponent window={window} app={APP_NAMES.PRE_CHECK_IN} />,
        );
        const button = component.getByTestId('get-local-button');
        fireEvent.click(button);
        expect(component.getByTestId('from-local').innerHTML).to.be.contain(
          '{}',
        );
      });
      it('key is found', () => {
        const window = {
          localStorage: {
            getItem: () => JSON.stringify({ facility: 'timestamp' }),
          },
        };

        const component = render(
          <TestComponent window={window} app={APP_NAMES.PRE_CHECK_IN} />,
        );
        const button = component.getByTestId('get-local-button');
        fireEvent.click(button);

        expect(component.getByTestId('from-local').innerHTML).to.equal(
          JSON.stringify({ facility: 'timestamp' }),
        );
      });
    });
  });
});
