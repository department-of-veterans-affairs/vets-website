export const assertDataLayerEvent = (win, eventName) => {
  assert.isObject(win.dataLayer.find(d => d.event && d.event === eventName));
};

export const assertDataLayerItem = (win, item) => {
  assert.isObject(win.dataLayer.find(d => d[item]));
};

export const assertEventAndAttributes = (win, event, attr) => {
  win.dataLayer.forEach(d => {
    if (Object.keys(d).length > 0 && Object.values(d).includes(event)) {
      attr.forEach(a => {
        expect(Object.keys(d)).to.include(a);
      });
    }
  });
};
