import React from 'react';

export const VhcButtonAttachment = props => (
  <form action={props.action} method="post" target="_blank">
    <input type="hidden" name="vamobilejwtv1" value={props.jwt} />
    <input type="submit" value={props.title} />
  </form>
);

export function extractContent(input) {
  // Extract the JSON string from the input
  const jsonString = input
    .toString()
    .trim()
    .split('The input from PVA is: ')[1]
    .split('. Now exiting the skill')[0];

  // Parse the JSON string to an object
  const jsonObject = JSON.parse(jsonString);

  // Extract the URL from the object
  return jsonObject.attachments[0].content;
}

export const attachmentMiddleware = () => next => card => {
  if (
    card.attachment.contentType === 'text/markdown' &&
    card.attachment.content.includes('The input from PVA is:')
  ) {
    const content = extractContent(card.attachment.content);
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
