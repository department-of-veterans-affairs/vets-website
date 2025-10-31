const askVaPath = '/contact-us/ask-va';

/** @param {string} conversationId Also known as "reference number" or "inquiry number" */
export const getConversationLink = conversationId => {
  return `${askVaPath}/user/dashboard/${conversationId}`;
};
