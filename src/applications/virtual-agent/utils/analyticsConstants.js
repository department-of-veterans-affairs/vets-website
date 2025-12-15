export const EVENT_API_CALL = 'api_call';

// Activity names emitted by the bot
export const ACTIVITY_EVENT_NAMES = {
  SKILL_ENTRY: 'Skill_Entry',
  SKILL_EXIT: 'Skill_Exit',
  AGENT_LLM_RESPONSE: 'AgentLLMResponse',
  RAG_ENTRY: 'Rag_Entry',
  RAG_EXIT: 'Rag_Exit',
};

// Canonical api_call "api-name" labels used for GA
export const API_CALL_NAMES = {
  SKILL_ENTRY: 'Chatbot Skill Entry',
  SKILL_EXIT: 'Chatbot Skill Exit',
  RAG_AGENT_ENTRY: 'Chatbot RAG Agent Entry',
  RAG_AGENT_EXIT: 'Chatbot RAG Agent Exit',
};
