export const assertDataLayerEvent = (win, eventName) => {
  assert.isObject(win.dataLayer.find(d => d.event && d.event === eventName));
};

export const assertDataLayerLastItems = (win, items, event) => {
  const eventTest = win.dataLayer
    .filter(d => d.event && d.event === event)
    .pop();
  items.forEach(a => {
    expect(Object.keys(eventTest)).to.include(a);
  });
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
