import { addListener, createListenerMiddleware } from '@reduxjs/toolkit';
// import type { RootState, AppDispatch } from './store'

export const listenerMiddleware = createListenerMiddleware();
console.log('listenerMiddleware', listenerMiddleware);

export const startAppListening = listenerMiddleware.startListening;
// ({
//   matcher: appointmentSlice.endpoints.getAppointments.matchFulfilled,
//   effect: async (action, listenerApi) => {
//     console.log('yea!!!!!!');
//   },
// });
// console.log('startAppListening',startAppListening)
console.log('listenerMiddleware', listenerMiddleware);
export const addAppListener = addListener();
// addPostsListeners(startAppListening);
// export const startAppListening = listenerMiddleware.startListening.withTypes<
//   RootState,
//   AppDispatch
// >()
// export type AppStartListening = typeof startAppListening

// export const addAppListener = addListener.withTypes<RootState, AppDispatch>()
// export type AppAddListener = typeof addAppListener
