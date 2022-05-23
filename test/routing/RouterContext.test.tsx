import { routeObjectsReducer } from "../../src/routing/RouterContext";

describe('Routing - Router Context', () => {
  test('router reducer returns list of routes', () => {
    // Some Dummy Data
    const routeObjects = [
      {
        index: true,
        path: undefined
      },
      {
        path: "/about",
        children: [
          {
            path: 'plants'
          },
        ]
      },
    ]
    // Dummy Data expected result
    const expectedResult = [
      '/',
      '/about',
      '/about/plants'
    ]

    const generatedRoutes = routeObjectsReducer(routeObjects);
    expect(generatedRoutes).toEqual(expectedResult);
  });

});
