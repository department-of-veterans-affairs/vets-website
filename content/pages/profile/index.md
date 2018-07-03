---
title: Your Vets.gov Profile
layout: page-react.html
entryname: va-profile
---
<div id="main">
  <nav aria-label="Breadcrumb" aria-live="polite" aria-relevant="additions text" class="va-nav-breadcrumbs js-visual"
  id="va-breadcrumbs">
    <ul class="row va-nav-breadcrumbs-list columns" id="va-breadcrumbs-list">
      <li><a href="/" onClick="recordEvent({ event: 'nav-breadcrumb', 'nav-breadcrumb-section': 'home' });">Home</a></li>
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
