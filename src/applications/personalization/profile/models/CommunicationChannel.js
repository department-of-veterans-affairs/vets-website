class CommunicationChannel {
  constructor({ id, parentItemId, permissionId, isAllowed }) {
    if (typeof id !== 'number') {
      throw new Error('Invalid Argument: options.id must be a number');
    }
    if (typeof parentItemId !== 'number') {
      throw new Error(
        'Invalid Argument: options.parentItemId must be a number',
      );
    }
    // id is _not_ a unique id for this channel. It corresponds to the channel's
    // type. Example: 1 = text, 2 = email
    this.id = id;
    this.parentItemId = parentItemId;
    this.permissionId = permissionId;
    this.isAllowed = !!isAllowed;
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
            id: this.id,
            communicationPermission: {
              allowed,
            },
          },
        },
      },
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
      id: this.id,
      parentItemId: this.parentItemId,
      isAllowed: this.isAllowed,
      permissionId: this.permissionId,
    });
  }
}

export default CommunicationChannel;
