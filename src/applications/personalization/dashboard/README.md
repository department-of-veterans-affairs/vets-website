# MyVA frontend

Last updated: March 28, 2023 — still WIP 🚧

The React/Redux frontend for the VA.gov MyVA.

- [MyVA frontend](#myva-frontend)
- [Purpose and overview](#purpose-and-overview)
- [Developing locally](#developing-locally)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

# Purpose and overview

# Developing locally

1. Make sure you have the `vets-website` repo cloned and installed. I prefer `yarn`, but you can also use `npm`.
```
git clone git@github.com:department-of-veterans-affairs/vets-website.git

cd vets-website/

yarn install
```

2. Start local server:
```
yarn watch --env entry=dashboard
```

3. Include mocked responses:
```
yarn mock-api --responses src/applications/personalization/dashboard/mocks/server.js
```

4. To simulate logged in status, copy and paste the following into your browser devtools:

```
localStorage.setItem('hasSession', true)
```

Visit [https://localhost:3001/my-va](https://localhost:3001/my-va).

# Testing



# Troubleshooting

# Resources