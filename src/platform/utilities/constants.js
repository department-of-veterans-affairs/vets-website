// TODO: Rename this to something that makes more sense
export const constantHandler = {
  get(target, propName) {
    if (!(propName in target)) {
      throw new Error(`${propName} not in target.`);
    }

    return target[propName];
  }
};


export const fetchStates = new Proxy({
  notCalled: 'not called',
  pending: 'pending',
  succeeded: 'succeeded',
  failed: 'failed'
}, constantHandler);
