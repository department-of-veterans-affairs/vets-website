/** @param {string} conversationId Also known as "reference number" or "inquiry number" */
export const getConversationLink = conversationId =>
  `/user/dashboard/${conversationId}`;
