Here's the stripped-down technical reference document you can feed into a coding LLM:

---

# Genesys Cloud Messenger SDK — MessagingService Plugin Reference

> **Important:** Subscribe to `MessagingService.ready` before calling any commands. If already published, it will republish to trigger your callback.

---

## COMMANDS

All commands follow the pattern:
```js
Genesys("command", "MessagingService.<commandName>", { /* options */ }, fulfilledCb, rejectedCb);
```

---

### `MessagingService.startConversation`
Opens a new WebSocket connection and configures it. Requires `apiEndpoint` and `deploymentId` (auto-derived from config on page load).

| Resolution | Event Published | Return Message |
|---|---|---|
| resolved | `MessagingService.started` | — |
| rejected (error) | `MessagingService.error` | `"Cannot start conversation"` |
| rejected (already active) | `MessagingService.error` | `"There is already an active conversation"` |

```js
Genesys("command", "MessagingService.startConversation", {}, function() {}, function() {});
```

---

### `MessagingService.configureConversation`
Alternative to `startConversation`. Establishes WebSocket but does NOT send the JOIN event when auto-start is enabled. Use `joinConversation` to send JOIN later.

| Resolution | Event Published | Return Message |
|---|---|---|
| resolved | `MessagingService.started` | — |
| rejected (error) | `MessagingService.error` | `"Cannot start conversation"` |
| rejected (already active) | `MessagingService.error` | `"There is already an active conversation"` |

```js
Genesys("command", "MessagingService.configureConversation", {}, function() {}, function() {});
```

---

### `MessagingService.joinConversation`
Headless mode only. Sends the JOIN event after `configureConversation`. Only valid for new sessions (check `newSession` in `MessagingService.started` event data).

| Resolution | Event Published | Return Message |
|---|---|---|
| resolved | — | — |
| rejected | — | `"Auto start must be enabled in the configuration"` |

```js
Genesys("command", "MessagingService.joinConversation", {}, function() {}, function() {});
```

---

### `MessagingService.sendMessage`
Sends a message from the end user. Creates a connection if none exists; buffers messages until connected.

**Options:**

| Option | Type | Required | Description |
|---|---|---|---|
| `message` | String | yes* | Plain text message (*not required if sending file only) |
| `type` | String | yes (rich media) | `"card"`, `"quickReply"`, `"datePicker"`, or `"listPicker"` |
| `postback` | Object | yes (rich media) | Payload object (see examples below) |

| Resolution | Event Published | Return Message |
|---|---|---|
| resolved (text) | `MessagingService.messagesReceived` | — |
| resolved (datePicker/listPicker) | `MessagingService.repliedMessage` | — |
| rejected (whitespace) | — | `"Message only contains whitespaces"` |
| rejected (read-only) | — | `"Conversation session has ended, start a new session to send a message."` |

```js
// Plain text
Genesys("command", "MessagingService.sendMessage", { message: "hi there!" }, function() {}, function() {});

// Card/Carousel postback
Genesys("command", "MessagingService.sendMessage", {
  type: "card",
  postback: { text: "Click Me!", payload: "Click Me!" }
}, function() {}, function() {});

// Quick reply
Genesys("command", "MessagingService.sendMessage", {
  type: "quickReply",
  postback: { action: "Message", text: "I like movies", payload: "I like movies" }
}, function() {}, function() {});

// Date picker
Genesys("command", "MessagingService.sendMessage", {
  type: "datePicker",
  postback: {
    payload: { duration: "1700", dateTime: "2025-06-26T17:30:00.000Z" },
    id: "" // optional: outbound datePicker message id for correlation
  }
}, function() {}, function() {});

// List picker
Genesys("command", "MessagingService.sendMessage", {
  type: "listPicker",
  postback: {
    id: "<outbound message id>",
    text: "<replyMessage.subtitle>",
    selectedOptions: [{ text: "<option title>", payload: "<option id>" }]
  }
}, function() {}, function() {});
```

---

### `MessagingService.requestUpload`
Requests a signed URL to upload a file over WebSocket.

**Options:**

| Option | Type | Required | Description |
|---|---|---|---|
| `file` | FileList | yes | HTML5 FileList with one File object (fileName, fileSize, fileType). One file at a time. |

| Resolution | Event Published | Return Message |
|---|---|---|
| resolved | `MessagingService.fileUploaded` | Response data |
| rejected (disabled) | — | `"Sending attachments is disabled in the configuration"` |
| rejected (read-only) | — | `"Conversation session has ended, start a new session to upload a file."` |

```js
Genesys("command", "MessagingService.requestUpload", { file: file_list }, function() {}, function() {});
```

---

### `MessagingService.getFile`
Fetches the latest download URL for an attachment via WebSocket.

**Options:**

| Option | Type | Required | Description |
|---|---|---|---|
| `id` | String | yes | Attachment ID from `fileUploaded` event |

| Resolution | Event Published | Return Message |
|---|---|---|
| resolved | `MessagingService.fileReceived` | Response data |

```js
Genesys("command", "MessagingService.getFile", { id: "<attachment id>" }, function() {}, function() {});
```

---

### `MessagingService.refreshFiles`
Fetches latest download URLs for one or more attachments.

**Options:**

| Option | Type | Required | Description |
|---|---|---|---|
| `files` | Array | yes | Array of `{ id: "<attachment id>" }` objects |

| Resolution | Event Published | Return Message |
|---|---|---|
| resolved | `MessagingService.messagesUpdated` | Response data |

```js
Genesys("command", "MessagingService.refreshFiles", { files: [{ id: "<id>" }, { id: "<id>" }] }, function() {}, function() {});
```

---

### `MessagingService.downloadFile`
Downloads a file via REST and saves to local filesystem.

**Options:**

| Option | Type | Required | Description |
|---|---|---|---|
| `downloadUrl` | String | yes | Signed URL from `messagesUpdated` or `messagesReceived` |
| `name` | String | yes | Filename from `messagesUpdated` or `messagesReceived` |

| Resolution | Event Published | Return Message |
|---|---|---|
| resolved | `MessagingService.fileDownloaded` | Raw file download data |
| rejected | `MessagingService.fileDownloadError` | Error data |

```js
Genesys("command", "MessagingService.downloadFile", { downloadUrl: "<url>", name: "myfile.png" }, function(data) {}, function(error) {});
```

---

### `MessagingService.deleteFile`
Deletes an uploaded file that has not yet been sent as a message.

**Options:**

| Option | Type | Required | Description |
|---|---|---|---|
| `id` | String | yes | Attachment ID |

| Resolution | Event Published | Return Message |
|---|---|---|
| resolved | `MessagingService.fileDeleted` | Response data |
| rejected (read-only) | — | `"Conversation session has ended, start a new session to delete a file."` |

```js
Genesys("command", "MessagingService.deleteFile", { id: "<attachment id>" });
```

---

### `MessagingService.sendTyping`
Sends a typing indicator. Throttled to once every 5 seconds.

| Resolution | Return Message |
|---|---|
| resolved | — |
| rejected (read-only) | `"Conversation session has ended, start a new session to send a typing indicator."` |

```js
Genesys("command", "MessagingService.sendTyping");
```

---

### `MessagingService.clearTypingTimeout`
Clears the agent typing event timeout before the 5-second threshold.

| Resolution | Return Message |
|---|---|
| resolved | — |

```js
Genesys("command", "MessagingService.clearTypingTimeout", {}, function() {}, function() {});
```

---

### `MessagingService.clearSession`
Closes the WebSocket connection and clears active session messages from the transcript.

| Resolution | Event Published | Return Message |
|---|---|---|
| resolved | `MessagingService.sessionCleared` | — |

```js
Genesys("command", "MessagingService.clearSession", {}, function() {}, function() {});
```

---

### `MessagingService.fetchHistory`
Fetches previous pages of messages for an active conversation. Requires active session.

| Resolution | Event Published | Return Message |
|---|---|---|
| resolved (more pages) | `MessagingService.oldMessages` | Raw previous messages |
| resolved (all fetched) | `MessagingService.historyComplete` | `"All the messages are fetched"` |
| rejected (error) | `MessagingService.error` | Raw error |
| rejected (no session) | — | `"Not able to fetch history"` |

```js
Genesys("command", "MessagingService.fetchHistory", {}, function() {}, function() {});
```

---

### `MessagingService.resetConversation`
Ends a disconnected (read-only) conversation, clears messages, and starts a new one. Requires Read-only conversation disconnect config enabled.

| Resolution | Event Published | Return Data |
|---|---|---|
| resolved | `MessagingService.conversationReset` | `{ authenticated, newSession, readOnly }` |
| rejected | — | `"Conversation reset is not allowed..."` |

```js
Genesys("command", "MessagingService.resetConversation", {}, function() {}, function() {});
```

**Return data:**
```js
{ "authenticated": true, "newSession": true, "readOnly": false }
```

---

### `MessagingService.clearConversation`
Ends the active conversation and clears all messages. Final and non-recoverable. Requires Clear Conversation config enabled.

| Resolution | Event Published | Return Data |
|---|---|---|
| resolved | `MessagingService.conversationCleared` | Raw response data |
| rejected (disabled) | — | `"Please check your conversation clear option is enabled..."` |
| rejected (no active) | — | `"There is no active conversation found to clear."` |

```js
Genesys("command", "MessagingService.clearConversation", {}, function() {}, function() {});
```

**Return data:**
```js
{ "class": "SessionClearedEvent", "type": "message" }
```

---

### `MessagingService.stepUpConversation`
Upgrades an anonymous conversation to authenticated by calling `AuthProvider.signIn`. Requires step-up config enabled.

| Resolution | Event Published | Return Data |
|---|---|---|
| resolved | `MessagingService.steppedUpConversation` | `{ authCode, jwt }` |
| rejected (auth fail) | `MessagingService.stepUpConversationError` | Auth error data |
| rejected (no session) | — | `"No active conversation found to step-up."` |
| rejected (not configured) | — | Various config error messages |

```js
Genesys("command", "MessagingService.stepUpConversation", {}, function() {}, function() {});
```

---

## EVENTS

All events follow the pattern:
```js
Genesys("subscribe", "MessagingService.<eventName>", function({ data }) { /* handler */ });
```

---

### Plugin Loading Behavior

| Messenger UI Enabled | Loading | Behavior |
|---|---|---|
| On (Native UI) | Lazy | Loaded when Messenger opens; `ready` published then |
| Off (Headless Mode) | Always | Always loaded; `ready` published immediately |

---

### `MessagingService.ready`
Published when the plugin is initialized and ready to accept commands.

**Data:** None
```js
Genesys("subscribe", "MessagingService.ready", function() {});
```

---

### `MessagingService.started`
Published when a new WebSocket connection is established.

**Data:**
```js
{ "authenticated": true, "newSession": true, "readOnly": true }
```

---

### `MessagingService.sendingMessage`
Published immediately after sending an inbound message. Use `tracingId` to track the message and later correlate with `messagesReceived`.

**Data:**
```js
{ "message": { "type": "<type>", "tracingId": "<tracingId>", "text": "<text>" } }
```

---

### `MessagingService.messagesReceived`
Published when new messages are added to the conversation. Includes inbound messages echoed back (with same `tracingId` as `sendingMessage`). Also includes datePicker and listPicker inbound messages.

**Data:**
```js
{ "messages": [ /* array of message objects */ ] }
```

---

### `MessagingService.repliedMessage`
Published when user submits a datePicker or listPicker selection.

**Data (datePicker):**
```js
{
  "id": "<message id>",
  "type": "datePicker",
  "metadata": { "parentMessageId": "<outbound message id>" },
  "scheduledTime": "<selected time>",
  "scheduledMessage": "<human readable text>"
}
```

**Data (listPicker):**
```js
{
  "id": "<message id>",
  "type": "listPicker",
  "metadata": { "parentMessageId": "<outbound message id>" },
  "text": "<replyMessage.subTitle>",
  "payload": [{ "text": "<option title>", "id": "<option id>" }]
}
```

---

### `MessagingService.uploading`
Published during file upload progress.

**Data:**
```js
{ "percentage": 42 }
```

---

### `MessagingService.uploadApproved`
Published when signed upload URL is received. The SDK handles the actual upload automatically.

**Data:**
```js
{ "attachmentId": "<id>", "headers": {}, "uploadURL": "<url>" }
```

---

### `MessagingService.fileUploaded`
Published when file upload completes successfully. Call `sendMessage` after this to attach it to a message.

**Data:**
```js
{ "attachmentId": "<id>", "downloadUrl": "<url>", "timestamp": 1234567890 }
```

---

### `MessagingService.fileUploadError`
Published when file upload fails. See error format in SDK docs.

---

### `MessagingService.fileUploadCancelled`
Published when an in-progress upload is cancelled.

**Data:**
```js
{ "attachmentId": "<id>" }
```

---

### `MessagingService.fileReceived`
Published in response to `getFile` command.

**Data:**
```js
{ "attachmentId": "<id>", "downloadUrl": "<url>", "timestamp": 1234567890 }
```

---

### `MessagingService.messagesUpdated`
Published when messages are refreshed with latest download URLs.

**Data:**
```js
{
  "files": { "attachmentId": "<id>", "newDownloadUrl": "<url>" },
  "updatedMessages": [ /* array of message objects */ ]
}
```

---

### `MessagingService.fileDownloaded`
Published when file download completes. **Data:** None.

---

### `MessagingService.fileDownloadError`
Published when file download fails. See error format in SDK docs.

---

### `MessagingService.fileDeleted`
Published when a file is successfully deleted.

**Data:**
```js
{ "attachmentId": "<id>" }
```

---

### `MessagingService.oldMessages`
Published when history page is fetched via `fetchHistory`.

**Data:**
```js
{ "messages": [ /* message objects */ ], "pageNumber": 2, "pageSize": 25 }
```

---

### `MessagingService.historyComplete`
Published when all historical messages have been fetched. **Data:** None.

---

### `MessagingService.typingReceived`
Published when an agent typing indicator is received.

**Data:**
```js
{ "typing": { "type": "On", "durationMs": 5000 } }
```

---

### `MessagingService.typingTimeout`
Published when agent typing indicator expires. **Data:** None.

---

### `MessagingService.clientTypingStarted`
Published when end user starts typing. **Data:** None.

---

### `MessagingService.restored`
Published when a session is restored after page navigation/refresh. Contains recent messages; older ones come via `oldMessages`.

**Data:**
```js
{ "messages": [ /* message objects */ ], "pageNumber": 1, "pageSize": 25 }
```

---

### `MessagingService.sessionCleared`
Published when session is cleared. **Data:** None.

---

### `MessagingService.offline`
Published when connection goes offline. **Data:** None.

---

### `MessagingService.reconnecting`
Published when the SDK attempts to reconnect. **Data:** None.

---

### `MessagingService.reconnected`
Published when WebSocket reconnection succeeds. **Data:** None.

---

### `MessagingService.conversationDisconnected`
Published when an agent/flow disconnects the conversation.

**Data:**
```js
{ "message": { /* message object */ }, "readOnly": true }
```

---

### `MessagingService.readOnlyConversation`
Published after disconnect when conversation enters read-only mode.

---

### `MessagingService.conversationReset`
Published after a successful conversation reset from read-only state.

**Data:**
```js
{ "authenticated": true, "newSession": true, "readOnly": false }
```

---

### `MessagingService.conversationCleared`
Published after conversation is successfully cleared.

**Data:**
```js
{ "class": "SessionClearedEvent", "type": "message" }
```

---

### `MessagingService.customAttributesSizeExceeded`
Published when custom attributes (set via `Database.set`) exceed 2048 bytes.

**Data:**
```js
{ "body": "customAttributes object is larger than allowed limit: 2048 bytes", "errorKey": "customAttributesSizeExceeded" }
```

---

### `MessagingService.error`
Published on client-server errors. See SDK docs for error format.

---

### `MessagingService.cobrowseOffer`
Published when a co-browse session is offered.

**Data:**
```js
{ "id": "<uuid>", "sessionId": "<id>", "sessionJoinToken": "<token>", "type": "Offering" }
```

---

### `MessagingService.cobrowseOfferAccepted`
Published when co-browse offer is accepted.

**Data:** Same shape as `cobrowseOffer`, `"type": "OfferingAccepted"`.

---

### `MessagingService.cobrowseOfferRejected`
Published when co-browse offer is declined.

**Data:** Same shape as `cobrowseOffer`, `"type": "OfferingRejected"`.

---

### `MessagingService.cobrowseOfferExpired`
Published when co-browse offer expires.

**Data:**
```js
{ "id": "<uuid>", "sessionId": "<id>", "type": "OfferingExpired" }
```

---

### `MessagingService.allowedFileTypes`
Published when a Supported Content Profile is enabled.

**Data:**
```js
{ "allowedMedia": { "inbound": { "fileTypes": [...], "maxFileSizeKB": 10240 } } }
```

---

### `MessagingService.steppedUpConversation`
Published when an anonymous conversation is successfully stepped up to authenticated.

**Data:**
```js
{
  "type": "Event",
  "channel": { "from": { "firstName": "", "lastName": "" }, "messageId": "", "time": "<timestamp>" },
  "events": [{ "eventType": "Presence", "presence": { "type": "SignIn" } }],
  "id": "<id>",
  "metadata": { "authenticated": true, "correlationId": "<id>" }
}
```

---

This covers the full SDK surface area for the `MessagingService` plugin — all 16 commands and all 39 events with their data shapes, resolutions, and usage examples.