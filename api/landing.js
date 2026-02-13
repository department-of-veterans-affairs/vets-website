/**
 * Landing page for the Vercel deployment.
 * Shows links to the available app entry points since the root page
 * has no React app mounted (static-pages only sets up header/footer widgets).
 */
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VA.gov Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f1f1f1;
      color: #323a45;
      min-height: 100vh;
    }
    .banner {
      background: #112e51;
      color: #fff;
      padding: 16px 24px;
      font-size: 14px;
    }
    .header {
      background: #112e51;
      padding: 24px 24px 32px;
    }
    .header h1 {
      color: #fff;
      font-size: 32px;
      font-weight: 700;
      max-width: 800px;
      margin: 0 auto;
    }
    .header p {
      color: #d6d7d9;
      font-size: 16px;
      max-width: 800px;
      margin: 8px auto 0;
    }
    .content {
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    h2 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #112e51;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .card {
      background: #fff;
      border: 1px solid #d6d7d9;
      border-radius: 4px;
      padding: 24px;
      text-decoration: none;
      color: inherit;
      transition: box-shadow 0.15s;
    }
    .card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      border-color: #0071bb;
    }
    .card h3 {
      color: #0071bb;
      font-size: 18px;
      margin-bottom: 8px;
    }
    .card p {
      color: #5b616b;
      font-size: 14px;
      line-height: 1.5;
    }
    .tag {
      display: inline-block;
      background: #e1f3f8;
      color: #205493;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 2px;
      margin-top: 12px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="banner">
    An official website of the United States government
  </div>
  <div class="header">
    <h1>VA.gov Preview</h1>
    <p>Vercel deployment for development and review</p>
  </div>
  <div class="content">
    <h2>Available Applications</h2>
    <div class="cards">
      <a class="card" href="/find-locations/">
        <h3>Facility Locator</h3>
        <p>Find VA locations including health facilities, benefits offices, and cemeteries near you.</p>
        <span class="tag">facilities</span>
      </a>
      <a class="card" href="/health-care/apply-for-health-care-form-10-10ez/">
        <h3>Health Care Application (10-10EZ)</h3>
        <p>Apply for VA health care benefits using the 10-10EZ form.</p>
        <span class="tag">hca</span>
      </a>
    </div>
  </div>
</body>
</html>`);
};
