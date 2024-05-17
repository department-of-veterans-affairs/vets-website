import React from 'react';

export const VhcButtonAttachment = props => (
  <form action={props.action} method="post" target="_blank">
    <input type="hidden" name="vamobilejwtv1" value="{ props.jwt }" />
    <input type="submit" value="{ props.title }" />
  </form>
);

export const attachmentMiddleware = () => next => card => {
  if (
    card.attachment.contentType ===
    'application/vnd.microsoft.botframework.samples.vhc-form-button'
  ) {
    return (
      <VhcButtonAttachment
        action={card.attachment.content.action}
        jwt={card.attachment.content.jwt}
        title={card.attachment.content.title}
      />
    );
  }

  return next(card);
};
