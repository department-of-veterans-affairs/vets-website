function overrideSmoothFormsScrolling(client) {
  client.execute(() => {
    const currentFormsScroll = window.Forms || {};
    window.Forms = Object.assign({}, currentFormsScroll, {
      scroll: {
        duration: 0,
        delay: 0,
        smooth: false,
      },
    });

    const currentVetsGovScroll = window.VetsGov || {};
    window.VetsGov = Object.assign({}, currentVetsGovScroll, {
      scroll: {
        duration: 0,
        delay: 0,
        smooth: false,
      },
    });

    return window.VetsGov;
  });
}

function overrideFormsScrolling(client) {
  overrideSmoothFormsScrolling(client);
  client.execute(() => {
    window.scrollTo = () => null;
  });
}

module.exports = {
  overrideFormsScrolling,
  overrideSmoothFormsScrolling,
};
