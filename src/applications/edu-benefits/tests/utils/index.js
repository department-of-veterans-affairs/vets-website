export const sessionStorageSetup = () => {
  let storage = {};
  global.sessionStorage = {
    getItem: key => (key in storage ? storage[key] : null),
    setItem: (key, value) => {
      storage[key] = value;
    },
    removeItem: key => delete storage[key],
    clear: () => {
      storage = {};
    },
  };
};
