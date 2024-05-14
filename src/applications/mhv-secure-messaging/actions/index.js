/*
Redux action that handles API calls. Currently mocked, but the imports needed are 
below whenever sandbox environments for local dev are set up. 

This is also where GA events may be fired for successful / unsuccessful api calls
*/

export const MESSAGES_RETRIEVE_STARTED = 'MESSAGES_RETRIEVE_STARTED';
export const MESSAGES_RETRIEVE_SUCCEEDED = 'MESSAGES_RETRIEVE_SUCCEEDED';
export const MESSAGES_RETRIEVE_FAILED = 'MESSAGES_RETRIEVE_FAILED';

export const MESSAGE_MOVE_STARTED = 'MESSAGE_MOVE_STARTED';
export const MESSAGE_MOVE_SUCCEEDED = 'MESSAGE_MOVE_SUCCEEDED';
export const MESSAGE_MOVE_FAILED = 'MESSAGE_MOVE_FAILED';

export const FOLDERS_RETRIEVE_STARTED = 'FOLDERS_RETRIEVE_STARTED';
export const FOLDERS_RETRIEVE_FAILED = 'FOLDERS_RETRIEVE_FAILED';
export const FOLDERS_RETRIEVE_SUCCEEDED = 'FOLDERS_RETRIEVE_SUCCEEDED';

export const THREAD_RETRIEVE_STARTED = 'THREAD_RETRIEVE_STARTED';
export const THREAD_RETRIEVE_SUCCEEDED = 'THREAD_RETRIEVE_SUCCEEDED';
export const THREAD_RETRIEVE_FAILED = 'THREAD_RETRIEVE_FAILED';

export const LOADING_COMPLETE = 'LOADING_COMPLETE';

// const SECURE_MESSAGES_URI = '/mhv/messages';

// const mockDataRequest = (request, messageId) => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       if (request === 'messages') resolve(allMessages);
//       if (request === 'draft') {
//         if (+messageDraft.id === +messageId) {
//           resolve(messageDraft);
//         } else {
//           resolve({ errors: ['message not found'] });
//         }
//       }
//       if (request === 'message') {
//         if (+message.id === +messageId) {
//           resolve(message);
//         } else {
//           resolve({ errors: ['message not found'] });
//         }
//       }
//     }, 1500);
//   });
// };

// const retrieveData = async (request, messageId) => {
//   try {
//     // replace with apiRequest when endpoint is ready
//     return await mockDataRequest(request, messageId);
//   } catch (error) {
//     return error;
//   }
// };

// export const getAllMessages = () => async dispatch => {
//   dispatch({ type: MESSAGES_RETRIEVE_STARTED });

//   const response = await retrieveData('messages');
//   if (response.errors) {
//     // handles errors and dispatch error action
//     // fire GA event for error
//     const error = response.errors[0];
//     dispatch({
//       type: MESSAGES_RETRIEVE_FAILED,
//       response: error,
//     });
//   } else {
//     // dispatch success action and GA event
//     dispatch({
//       type: MESSAGES_RETRIEVE_SUCCEEDED,
//       response,
//     });
//   }
// };

// const mockMoveMessage = (messageId, folderId) => {
//   let mockSuccess = null;
//   if (messageId && folderId) {
//     mockSuccess = true;
//   }
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(mockSuccess);
//     }, 1500);
//   });
// };

// const moveMessageResponse = async (messageId, folderId) => {
//   try {
//     // replace with apiRequest when endpoint is ready
//     // `mhv-sm-api/patient/v1/message/${messageId}/move/tofolder/${folderId}`

//     return await mockMoveMessage(() => {
//       return { messageId, folderId };
//     });
//   } catch (error) {
//     return error;
//   }
// };

// export const moveMessageToFolder = (messageId, folderId) => async dispatch => {
//   dispatch({ type: MESSAGE_MOVE_STARTED });
//   const response = await moveMessageResponse(messageId, folderId);
//   if (response) {
//     dispatch({
//       type: MESSAGE_MOVE_FAILED,
//       response,
//     });
//   } else {
//     dispatch({
//       type: MESSAGE_MOVE_SUCCEEDED,
//       response,
//     });
//   }
// };

// const mockGetAllFolders = () => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(mockFolderData);
//     }, 1500);
//   });
// };

// const getFolders = async () => {
//   try {
//     return await mockGetAllFolders();
//   } catch (error) {
//     return error;
//   }
// };

// export const getAllFolders = () => async dispatch => {
//   dispatch({ type: FOLDERS_RETRIEVE_STARTED });

//   const response = await getFolders();
//   if (response.errors) {
//     const error = response.errors[0];
//     dispatch({
//       type: FOLDERS_RETRIEVE_FAILED,
//       response: error,
//     });
//   } else {
//     dispatch({
//       type: FOLDERS_RETRIEVE_SUCCEEDED,
//       response,
//     });
//   }
// };

// // export const getThread = messageId => async dispatch => {
// export const getThread = () => async dispatch => {
//   dispatch({ type: THREAD_RETRIEVE_STARTED });
//   const response = await retrieveData('messages');
//   if (response.errors) {
//     const error = response.errors[0];
//     dispatch({ type: THREAD_RETRIEVE_FAILED, response: error });
//   } else {
//     dispatch({ type: THREAD_RETRIEVE_SUCCEEDED, response: response.data });
//   }
// };
