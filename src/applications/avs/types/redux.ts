// Redux store and state types

// Redux root state interface that represents the entire application state
export interface RootState {
  user: {
    login: {
      currentlyLoggedIn: boolean;
    };
    profile?: {
      session?: {
        ssoe?: boolean;
      };
    };
  };
  // The AVS reducer state (currently empty but can be expanded)
  avs: AvsState;
}

// Local AVS application state (for the avs reducer slice)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AvsState {
  // Currently the reducer is empty, but will be expanded when state management is added
}
