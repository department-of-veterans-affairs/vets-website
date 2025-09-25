export const EVENT_API_CALL = 'api_call';

// Activity names emitted by the bot
export const ACTIVITY_EVENT_NAMES = {
  SKILL_ENTRY: 'Skill_Entry',
  SKILL_EXIT: 'Skill_Exit',
  AGENT_LLM_RESPONSE: 'AgentLLMResponse',
  AGENT_SEMANTIC_SEARCH_RESPONSE: 'AgentSemanticSearchResponse',
};

// Canonical api_call "api-name" labels used for GA
export const API_CALL_NAMES = {
  SKILL_ENTRY: 'Chatbot Skill Entry',
  SKILL_EXIT: 'Chatbot Skill Exit',
  RAG_AGENT_RESPONSE: 'Chatbot RAG Agent Response',
  SIGNIN_RESPONSE: 'Chatbot Sign-In Response',
  SEMANTIC_SEARCH_AGENT: 'Chatbot Semantic Search (Agent)',
};
