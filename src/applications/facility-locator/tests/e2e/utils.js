export const assertDataLayerEvent = (win, eventName) => {
  assert.isObject(win.dataLayer.find(d => d.event && d.event === eventName));
};

export const assertDataLayerItem = (win, item) => {
  assert.isObject(win.dataLayer.find(d => d[item]));
};
