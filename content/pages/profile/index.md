---
title: Your Vets.gov Profile
layout: page-react.html
entryname: profile-360
---
<div id="main">
  <nav aria-label="Breadcrumb" aria-live="polite" aria-relevant="additions text" class="va-nav-breadcrumbs js-visual"
  id="va-breadcrumbs">
    <ul class="row va-nav-breadcrumbs-list columns" id="va-breadcrumbs-list">
      <li><a href="/" id="account-home">Home</a></li>
      <li><a aria-current="page" href="/profile/">Your Profile</a></li>
    </ul>
  </nav>

  <div class="section">
    <div id="react-root">
      <div class="loading-message">
        <h3>Please wait while we load the application for you.</h3>
        <img src="/img/preloader-primary-darkest.gif" alt="Loading">
      </div>
    </div>
  </div>
  <!-- Profile Beta End -->
</div>

<script>
  (function() {
    var accountHomeLink = document.getElementById('account-home');
    accountHomeLink.addEventListener('click', function(ev) {
      recordEvent({ event: 'nav-breadcrumb', 'nav-breadcrumb-section': 'home' });
    });
  })();
</script>
