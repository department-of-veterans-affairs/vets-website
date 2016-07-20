# Prescriptions Frontend 

The react/redux frontend for the Vets.gov prescription refill project.

## TODO (alexose):

 * Pull in header/footer markup and CSS from vets-website
 * Update vets-website build process to include this project

## Install 
```
npm install
npm start
```

This will serve the `public` directory on port 8080 using the `webpack-dev-server`. The `webpack-dev-server` will watch all files under `src` transitively referenced by `src/client.js` and run webpack to build `public/js/generated/bundle.js`

Visit [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/) to load the app with webpack "hot reload" support (change to the source code are pushed and merged into the running application in the browser without having to refresh the page).

Visiting [http://localhost:8080](http://localhost:8080) will show the app without the hot reloading.
