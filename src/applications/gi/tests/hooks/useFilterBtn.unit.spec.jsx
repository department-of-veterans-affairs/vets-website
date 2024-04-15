import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';
import { waitFor } from '@testing-library/react';
import PropTypes from 'prop-types';
import { useFilterBtn } from '../../hooks/useFilterbtn';

function TestComponent(props) {
  const { focusOnFirstInput, setIsCleared } = useFilterBtn();

  const inputRef = React.useRef();

  React.useEffect(
    () => {
      if (inputRef.current) {
        focusOnFirstInput('Public', inputRef.current);
      }
    },
    [focusOnFirstInput],
  );

  TestComponent.propTypes = {
    hookMethodsRef: PropTypes.shape({
      current: PropTypes.shape({
        setIsCleared: PropTypes.func.isRequired,
      }),
    }),
  };

  React.useEffect(
    () => {
      const { hookMethodsRef } = props || {};
      if (hookMethodsRef) {
        hookMethodsRef.current = { setIsCleared };
      }
    },
    [props, props.hookMethodsRef, setIsCleared],
  );

  return <input ref={inputRef} />;
}

describe('useFilterButton', () => {
  let clock;
  let wrapper;
  let hookMethodsRef;

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });
    hookMethodsRef = React.createRef();
    act(() => {
      wrapper = mount(<TestComponent hookMethodsRef={hookMethodsRef} />);
    });
  });

  afterEach(() => {
    clock.restore();
    act(() => {
      wrapper.unmount();
    });
  });

  it('focuses the input after isCleared is set to true', async () => {
    const input = wrapper.find('input').getDOMNode();
    const focusSpy = sinon.spy(input, 'focus');

    act(() => {
      hookMethodsRef.current.setIsCleared(true);
    });

    act(() => {
      wrapper.setProps({});
    });
    clock.tick(2600);
    await waitFor(() => {
      expect(focusSpy.calledOnce).to.be.true;
    });
    focusSpy.restore();
  });
});
