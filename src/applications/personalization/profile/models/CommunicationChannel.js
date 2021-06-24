class CommunicationChannel {
  constructor({ id, parentItemId, permissionId, isAllowed = null }) {
    if (typeof id !== 'number') {
      throw new Error('Invalid Argument: options.id must be a number');
    }
    if (typeof parentItemId !== 'number') {
      throw new Error(
        'Invalid Argument: options.parentItemId must be a number',
      );
    }
    this.id = id;
    this.parentItemId = parentItemId;
    this.permissionId = permissionId;
    this.isAllowed = isAllowed;
  }

  setIsAllowed(isAllowed) {
    this.isAllowed = isAllowed;
  }

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
}

export default CommunicationChannel;
