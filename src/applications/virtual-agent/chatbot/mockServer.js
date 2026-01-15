/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 2024;

app.use(cors());
app.options('*', cors());
app.use(express.json());

const pickUserMessage = commands => {
  if (!Array.isArray(commands)) return '';
  const lastAddMessage = [...commands]
    .reverse()
    .find(command => command.type === 'add-message');

  if (!lastAddMessage) return '';
  const parts = lastAddMessage.message?.parts || [];
  const textPart = parts.find(part => part.type === 'text');
  if (textPart?.text) return textPart.text;
  return '';
};

const buildNextState = (state, userMessage, assistantMessage) => {
  const existingMessages = Array.isArray(state?.messages) ? state.messages : [];
  return {
    ...state,
    messages: [
      ...existingMessages,
      {
        role: 'user',
        content: [{ type: 'text', text: userMessage }],
      },
      {
        role: 'assistant',
        content: [{ type: 'text', text: assistantMessage }],
      },
    ],
  };
};

app.post('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

  const userMessage = pickUserMessage(req.body?.commands);
  const responseText = `Received message: ${userMessage || '...'}`;
  const nextState = buildNextState(req.body?.state, userMessage, responseText);

  console.log(`Mock server received message: "${userMessage}"`);

  const chunks = [
    {
      path: [0],
      type: 'part-start',
      part: { type: 'text' },
    },
    {
      path: [0],
      type: 'text-delta',
      textDelta: responseText,
    },
    {
      path: [0],
      type: 'part-finish',
    },
    {
      path: [],
      type: 'update-state',
      operations: [
        {
          type: 'set',
          path: [],
          value: nextState,
        },
      ],
    },
    {
      path: [0],
      type: 'message-finish',
      finishReason: 'stop',
      usage: { promptTokens: 0, completionTokens: 0 },
    },
  ];

  res.write(':\n\n');

  setTimeout(() => {
    chunks.forEach(chunk => {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    });

    res.write('data: [DONE]\n\n');
    res.end();
  }, 10);
});

app.listen(PORT, () => {
  console.log(
    `Mock assistant-transport server listening on http://127.0.0.1:${PORT}`,
  );
});
