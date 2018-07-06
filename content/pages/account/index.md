---
title: Your Vets.gov Account
layout: page-react.html
entryname: account
---
<div id="main">
  <nav aria-label="Breadcrumb" aria-live="polite" class="va-nav-breadcrumbs" id="va-breadcrumbs">
    <ul class="row va-nav-breadcrumbs-list columns" id="va-breadcrumbs-list">
      <li><a href="/" onClick="recordEvent({ event: 'nav-breadcrumb', 'nav-breadcrumb-section': 'home' });">Home</a></li>
      <li><a aria-current="page" href="/account/">Your Account Settings</a></li>
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
  <!-- Account Beta End -->
</div>
