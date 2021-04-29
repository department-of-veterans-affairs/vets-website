import React, { useMemo } from 'react';
import MarkdownRenderer from './markdownRenderer';
import makeBotGreetUser from './makeBotGreetUser';

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

  const styleOptions = {
    hideUploadButton: true,
    botAvatarBackgroundColor: '#003e73', // color-primary-darker
    botAvatarInitials: 'VA',
    userAvatarBackgroundColor: '#003e73', // color-primary-darker
    userAvatarInitials: 'You',
  };

  return (
    <div data-testid={'webchat'} style={{ height: '550px', width: '100%' }}>
      <ReactWebChat
        styleOptions={styleOptions}
        directLine={directLine}
        store={store}
        renderMarkdown={renderMarkdown}
      />
    </div>
  );
};

export default WebChat;
