class CommunicationGroup {
  constructor({ id, communicationChannels }) {
    if (typeof id !== 'number') {
      throw new TypeError('id should be a number');
    }
    if (!Array.isArray(communicationChannels)) {
      throw new TypeError('communicationChannels should be an array');
    }
    this.id = id;
    this.channels = communicationChannels;
  }

  getUpdatedChannels(wipGroup) {
    if (this.id !== wipGroup.id) {
      return [];
    }
    // loop over this instance's channels and compare each to the wipGroup's
    // comparable channel, returning the wipGroup's channels that are different
    return this.channels.reduce((updatedChannels, baseChannel) => {
      const wipChannel = wipGroup.channels.find(channel => {
        return (
          channel.type === baseChannel.type &&
          channel.parentItemId === baseChannel.parentItemId
        );
      });
      if (!wipChannel.isIdenticalTo(baseChannel)) {
        updatedChannels.push(wipChannel);
      }
      return updatedChannels;
    }, []);
  }

  clone() {
    const clonedChannels = this.channels.map(channel => {
      return channel.clone();
    });
    return new CommunicationGroup({
      id: this.id,
      communicationChannels: clonedChannels,
    });
  }
}

export default CommunicationGroup;
