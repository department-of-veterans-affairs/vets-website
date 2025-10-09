// Redux store and state types

// Redux root state interface that represents the entire application state
export interface RootState {
  user: {
    profile?: {
      session?: {
        ssoe?: boolean;
      };
      // Add other user profile fields as needed
    };
    // Add other user state fields as needed
  };
  // The AVS reducer state (currently empty but can be expanded)
  avs: AvsState;
  // Add other top-level state slices as needed
}

// Local AVS application state (for the avs reducer slice)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AvsState {
  // Currently the reducer is empty, but will be expanded when state management is added
}
