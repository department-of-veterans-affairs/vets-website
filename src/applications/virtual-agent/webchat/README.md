# VA Virtual Agent on vets-website Quick Guide
````
nvm use
````
````
yarn install
````
- To generate an index.html code coverage report for the virtual-agent app
```
yarn test:coverage-app virtual-agent
```
> [!NOTE]
> All tests must pass. You can use it.skip temporarily

- To run all unit tests in a specific file
```
npm run test:unit -- "path to file"
```
- to run just the virtual agent website
```
yarn watch --env entry=static-pages,auth,virtual-agent
```