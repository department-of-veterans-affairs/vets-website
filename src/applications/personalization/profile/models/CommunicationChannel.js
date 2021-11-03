class CommunicationChannel {
  constructor({ type, parentItemId, permissionId, isAllowed, wasAllowed }) {
    if (typeof type !== 'number' || type < 1 || type > 2) {
      throw new Error(
        'Invalid Argument: options.type must be a valid channel type',
      );
    }
    if (typeof parentItemId !== 'number') {
      throw new Error(
        'Invalid Argument: options.parentItemId must be a number',
      );
    }
    this.type = type;
    this.parentItemId = parentItemId;
    this.permissionId = permissionId;
    this.isAllowed = !!isAllowed;
    this.wasAllowed = wasAllowed;
  }

  setIsAllowed(isAllowed) {
    this.isAllowed = isAllowed;
  }

  /**
   * Method that returns an object that can easily handled by the
   * saveCommunicationPreferenceGroup() thunk creator.
   *
   * @returns an object with the following keys:
   * - endpoint: '/profile/communication_preferences' or
   *   '/profile/communication_preferences/:id'
   * - method: 'POST' or 'PATCH'
   * - payload: object that can used as the request body by either endpoint
   * @memberof CommunicationChannel
   */
  getApiCallObject() {
    const method = this.permissionId ? 'PATCH' : 'POST';
    const endpoint = this.permissionId
      ? `/profile/communication_preferences/${this.permissionId}`
      : '/profile/communication_preferences';
    const allowed = this.isAllowed;

    return {
      method,
      endpoint,
      payload: {
        communicationItem: {
          id: this.parentItemId,
          communicationChannel: {
            id: this.type,
            communicationPermission: {
              allowed,
            },
          },
        },
      },
      isAllowed: allowed,
      wasAllowed: this.wasAllowed,
    };
  }

  // returns true if the argument is a CommunicationChannel with identical
  // property values as this instance
  isIdenticalTo(otherCommunicationChannel) {
    if (!(otherCommunicationChannel instanceof CommunicationChannel)) {
      throw new Error(
        'Invalid Argument: argument must be an instance of CommunicationChannel',
      );
    }
    // compare all of this instance's properties to the
    // otherCommunicationChannel's corresponding properties
    return Object.entries(this).reduce((acc, [key, value]) => {
      if (otherCommunicationChannel[key] !== value) {
        return false;
      }
      return acc;
    }, true);
  }

  clone() {
    return new CommunicationChannel({
      type: this.type,
      parentItemId: this.parentItemId,
      isAllowed: this.isAllowed,
      permissionId: this.permissionId,
    });
  }
}

export default CommunicationChannel;
