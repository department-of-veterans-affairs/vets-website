import { renderHook } from '@testing-library/react';
import useHandleKeyDown from '../useHandleKeyDown';

const appointment = {
  id: '1234',
};

describe('useHandleKeyDown', () => {
  test('should render the initial count', () => {
    const testLink = '#testLink';
    const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
    const { result } = renderHook(useHandleKeyDown({ testLink, idClickable }));
    // fireEvent.click returns false if event is cancelable, and at least one of the event
    // handlers which received event called Event.preventDefault(). Otherwise true.
    // We do not expect preventDefault() to be called if the link is active.
    expect(result).toBe(0);
  });
});
