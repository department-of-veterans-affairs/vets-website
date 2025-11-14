import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import * as WebChat from 'botframework-webchat';

import useWebChatFramework from '../../hooks/useWebChatFramework';
import { COMPLETE } from '../../utils/loadingStatus';

describe('useWebChatFramework', () => {
  it('returns the botframework-webchat exports immediately', () => {
    const { result } = renderHook(() => useWebChatFramework({ timeout: 1000 }));

    expect(result.current.loadingStatus).to.equal(COMPLETE);
    expect(result.current.webChatFramework).to.equal(WebChat);
  });
});
