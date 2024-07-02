import React from 'react';

export const VhcButtonAttachment = props => (
  <form action={props.action} method="post" target="_blank">
    <input type="hidden" name="vamobilejwtv1" value={props.jwt} />
    <input type="submit" value={props.title} />
  </form>
);

export const attachmentMiddleware = () => next => card => {
  if (
    card.attachment.contentType ===
    'application/vnd.va_chatbot.card.formPostButton'
  ) {
    const { content } = card.attachment;
    return (
      <VhcButtonAttachment
        action={content.action}
        jwt={content.jwt}
        title={content.title}
      />
    );
  }

  return next(card);
};
