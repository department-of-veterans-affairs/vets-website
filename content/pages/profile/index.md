---
title: Your Vets.gov Profile
layout: page-react.html
entryname: profile-360
---
<div id="main">
  <nav aria-label="Breadcrumb" aria-live="polite" class="va-nav-breadcrumbs" id="va-breadcrumbs">
    <ul class="row va-nav-breadcrumbs-list columns" id="va-breadcrumbs-list">
<<<<<<< HEAD
      <li><a href="/" id="home">Home</a></li>
=======
      <li><a href="/" onClick="onClick="recordEvent({ event: 'nav-breadcrumb', 'nav-breadcrumb-section': 'home' });">Home</a></li>
>>>>>>> origin/master
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
<<<<<<< HEAD

<script>
  (function() {
    var accountHomeLink = document.getElementById('home');
    accountHomeLink.addEventListener('click', function(ev) {
      recordEvent({ event: 'nav-breadcrumb', 'nav-breadcrumb-section': 'home' });
    });
  })();
</script>
=======
>>>>>>> origin/master
