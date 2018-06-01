export function overrideSmoothFormsScrolling(client) {
  client.execute(() => {
    const current = window.Forms || {};
    window.Forms = Object.assign({}, current, {
      scroll: {
        duration: 0,
        delay: 0,
        smooth: false
      }
    });
    return window.Forms;
  });
}

export function overrideFormsScrolling(client) {
  overrideSmoothFormsScrolling(client);
  client.execute(() => {
    window.scrollTo = () => null;
  });
}
