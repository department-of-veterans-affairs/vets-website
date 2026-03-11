/**
 * Review Instance: Content Build Status Banner
 *
 * Polls the /status endpoint and displays an informational banner while
 * content-build is still running in the background. Self-removes when done.
 * Includes an expandable checklist showing all build steps.
 */
(function reviewStatusBanner() {
  const POLL_INTERVAL = 5000;
  const CONTENT_BUILD_START_STEP = 5;
  const bannerId = 'ri-content-build-banner';
  const DISMISS_KEY = 'ri-banner-dismissed';
  let expanded = false;
  let dismissed = false;

  try {
    dismissed = sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch (e) {
    // sessionStorage may be unavailable (e.g. restrictive privacy settings)
  }

  // Inline styles to avoid stylesheet dependency
  const STYLES = {
    banner: [
      'position:fixed',
      'bottom:0',
      'left:0',
      'right:0',
      'background:#112e51',
      'color:#f0f0f0',
      'font-family:Source Sans Pro,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif',
      'font-size:14px',
      'z-index:99999',
      'box-shadow:0 -2px 6px rgba(0,0,0,0.2)',
    ].join(';'),
    bar: [
      'display:flex',
      'align-items:center',
      'justify-content:space-between',
      'padding:10px 20px',
      'cursor:pointer',
    ].join(';'),
    msg: 'flex:1;',
    toggle: [
      'background:none',
      'border:none',
      'color:#f0f0f0',
      'font-size:14px',
      'cursor:pointer',
      'padding:0 12px',
      'display:flex',
      'align-items:center',
      'gap:4px',
    ].join(';'),
    dismiss: [
      'background:none',
      'border:none',
      'color:#f0f0f0',
      'font-size:18px',
      'cursor:pointer',
      'padding:0 0 0 8px',
    ].join(';'),
    panel: [
      'max-height:0',
      'overflow:hidden',
      'transition:max-height 0.3s ease',
      'background:rgba(0,0,0,0.15)',
    ].join(';'),
    panelInner: 'padding:0 20px;',
    item: [
      'display:flex',
      'align-items:center',
      'padding:8px 10px',
      'margin-bottom:6px',
      'border-radius:4px',
      'font-size:13px',
    ].join(';'),
    itemCompleted:
      'background:rgba(0,207,255,0.15);border-left:3px solid #00cfff;',
    itemInProgress:
      'background:rgba(255,193,7,0.15);border-left:3px solid #ffc107;',
    itemPending:
      'background:rgba(0,0,0,0.2);opacity:0.5;border-left:3px solid transparent;',
    iconWrap: 'width:20px;height:20px;margin-right:10px;flex-shrink:0;',
  };

  const SVG_ICONS = {
    completed:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width:100%;height:100%">' +
      '<circle cx="12" cy="12" r="11" fill="#00cfff"/>' +
      '<path d="M7 12l3 3 7-7" stroke="#112e51" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',
    'in-progress':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width:100%;height:100%">' +
      '<circle cx="12" cy="12" r="11" fill="#ffc107"/>' +
      '<circle cx="12" cy="12" r="4" fill="#112e51"/>' +
      '</svg>',
    pending:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width:100%;height:100%">' +
      '<circle cx="12" cy="12" r="11" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none"/>' +
      '</svg>',
  };

  function removeBanner() {
    const banner = document.getElementById(bannerId);
    if (banner) banner.remove();
  }

  function togglePanel() {
    expanded = !expanded;
    const panel = document.getElementById(`${bannerId}-panel`);
    const toggle = document.getElementById(`${bannerId}-toggle`);
    if (!panel || !toggle) return;

    if (expanded) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Hide build steps');
      toggle.innerHTML = 'Details <span style="font-size:10px;">\u25BC</span>';
    } else {
      panel.style.maxHeight = '0';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Show build steps');
      toggle.innerHTML = 'Details <span style="font-size:10px;">\u25B2</span>';
    }
  }

  function dismissBanner() {
    dismissed = true;
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch (e) {
      // sessionStorage may be unavailable
    }
    removeBanner();
  }

  function createBanner() {
    if (document.getElementById(bannerId)) return;

    const banner = document.createElement('div');
    banner.id = bannerId;
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.style.cssText = STYLES.banner;

    // Top bar (message + toggle + dismiss)
    const bar = document.createElement('div');
    bar.style.cssText = STYLES.bar;
    bar.onclick = function handleBarClick(e) {
      // Don't toggle if clicking dismiss button
      if (e.target.getAttribute('aria-label') === 'Dismiss banner') return;
      togglePanel();
    };

    const msg = document.createElement('span');
    msg.id = `${bannerId}-msg`;
    msg.style.cssText = STYLES.msg;
    msg.textContent =
      'Content pages are still building in the background\u2026';

    const toggleBtn = document.createElement('button');
    toggleBtn.id = `${bannerId}-toggle`;
    toggleBtn.setAttribute('aria-label', 'Show build steps');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.style.cssText = STYLES.toggle;
    toggleBtn.innerHTML = 'Details <span style="font-size:10px;">\u25B2</span>';
    toggleBtn.onclick = function handleToggleClick(e) {
      e.stopPropagation();
      togglePanel();
    };

    const dismiss = document.createElement('button');
    dismiss.textContent = '\u2715';
    dismiss.setAttribute('aria-label', 'Dismiss banner');
    dismiss.style.cssText = STYLES.dismiss;
    dismiss.onclick = function handleDismissClick(e) {
      e.stopPropagation();
      dismissBanner();
    };

    bar.appendChild(msg);
    bar.appendChild(toggleBtn);
    bar.appendChild(dismiss);

    // Expandable panel
    const panel = document.createElement('div');
    panel.id = `${bannerId}-panel`;
    panel.style.cssText = STYLES.panel;

    const panelInner = document.createElement('div');
    panelInner.id = `${bannerId}-steps`;
    panelInner.style.cssText = STYLES.panelInner;

    panel.appendChild(panelInner);
    banner.appendChild(bar);
    banner.appendChild(panel);
    document.body.appendChild(banner);
  }

  function renderSteps(steps) {
    const container = document.getElementById(`${bannerId}-steps`);
    if (!container || !steps || !steps.length) return;

    let html = '';
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      let statusStyle = STYLES.itemPending;
      if (s.status === 'completed') {
        statusStyle = STYLES.itemCompleted;
      } else if (s.status === 'in-progress') {
        statusStyle = STYLES.itemInProgress;
      }
      html +=
        `<div style="${STYLES.item}${statusStyle}">` +
        `<span style="${STYLES.iconWrap}">${SVG_ICONS[s.status] ||
          SVG_ICONS.pending}</span>` +
        `<span>${s.name}</span>` +
        `</div>`;
    }
    container.innerHTML = html;

    // Re-adjust panel height if expanded
    if (expanded) {
      const panel = document.getElementById(`${bannerId}-panel`);
      if (panel) panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  }

  function updateBanner(message) {
    const msg = document.getElementById(`${bannerId}-msg`);
    if (msg) msg.textContent = message;
  }

  function getStepMessage(steps) {
    if (!steps || !steps.length)
      return 'Content pages are still building\u2026';
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].status === 'in-progress') {
        return `${steps[i].name}\u2026`;
      }
    }
    return 'Content pages are still building\u2026';
  }

  function contentBuildDone(data) {
    if (data.status === 'ready' && data.percent >= 100) return true;
    if (!data.steps) return false;
    for (let i = 0; i < data.steps.length; i++) {
      if (
        data.steps[i].id >= CONTENT_BUILD_START_STEP &&
        data.steps[i].status !== 'completed'
      ) {
        return false;
      }
    }
    return true;
  }

  let polling = null;

  function poll() {
    fetch('/status')
      .then(function parseJson(r) {
        return r.json();
      })
      .then(function handleStatus(data) {
        if (contentBuildDone(data)) {
          // Build finished — clear any dismiss state and remove banner
          try {
            sessionStorage.removeItem(DISMISS_KEY);
          } catch (e) {
            // sessionStorage may be unavailable
          }
          removeBanner();
          clearInterval(polling);
          return;
        }
        if (dismissed) return;
        createBanner();
        updateBanner(getStepMessage(data.steps));
        renderSteps(data.steps);
      })
      .catch(function handleError() {
        // Status endpoint unavailable (maybe sidecar down) - remove banner
        removeBanner();
        clearInterval(polling);
      });
  }

  // Start polling after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      poll();
      polling = setInterval(poll, POLL_INTERVAL);
    });
  } else {
    poll();
    polling = setInterval(poll, POLL_INTERVAL);
  }
})();
