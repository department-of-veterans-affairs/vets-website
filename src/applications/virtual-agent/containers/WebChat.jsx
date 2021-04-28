import React, { useMemo } from 'react';
import MarkdownRenderer from '../utils/markdownRenderer';
import makeBotGreetUser from '../utils/webchat/makeBotGreetUser';

const renderMarkdown = text => MarkdownRenderer.render(text);

const WebChat = ({ token, WebChatFramework }) => {
  const { ReactWebChat, createDirectLine, createStore } = WebChatFramework;

  const store = createStore({}, makeBotGreetUser);

  const directLine = useMemo(
    () =>
      createDirectLine({
        token,
        domain:
          'https://northamerica.directline.botframework.com/v3/directline',
      }),
    [token, createDirectLine],
  );

  return (
    <div data-testid={'webchat'} style={{ height: '500px', width: '100%' }}>
      <ReactWebChat
        styleOptions={{ hideUploadButton: true }}
        directLine={directLine}
        store={store}
        renderMarkdown={renderMarkdown}
      />
    </div>
  );
};

export default WebChat;
