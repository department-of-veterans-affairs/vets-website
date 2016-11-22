---
layout: page.html
title: Logout
---

<div class="main home" role="main">
  <div class="section main-menu">
    <div class="row">
      <div class="small-12 columns">
        <div style="padding: 2em 0;">
        <h3>Signing out of Vets.gov...</h3>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
if (location.search.substring(1) === 'success=true') {
  window.opener.sessionStorage.removeItem('userToken');
  window.opener.sessionStorage.removeItem('entryTime');
  window.opener.location.reload();
  window.close();
}
</script>
