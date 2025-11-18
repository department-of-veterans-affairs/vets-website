import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';

import WebChatFrameworkBase from '../../utils/webChatFrameworkBase';

describe('webChatFrameworkBase', () => {
  it('provides webChatFrameworkBase stubs in the test environment', async () => {
    expect(WebChatFrameworkBase.createDirectLine).to.be.a('function');
    expect(WebChatFrameworkBase.createStore).to.be.a('function');
    expect(WebChatFrameworkBase.Components.BasicWebChat).to.be.a('function');
    expect(WebChatFrameworkBase.Components.Composer).to.be.a('function');

    expect(await WebChatFrameworkBase.createDirectLine()).to.deep.equal({});
    expect(await WebChatFrameworkBase.createStore()).to.deep.equal({});

    const basicWebChatResult = render(
      <WebChatFrameworkBase.Components.BasicWebChat />,
    );
    expect(basicWebChatResult.getByText('BasicWebChat')).to.exist;

    const composerResult = render(<WebChatFrameworkBase.Components.Composer />);
    expect(composerResult.getByText('Composer')).to.exist;
  });
});
