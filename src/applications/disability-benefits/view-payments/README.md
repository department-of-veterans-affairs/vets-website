App Name: `View Payments`
Active engineers: Micah Chiang (front end), Jesse Cohn (front end), Kathleen Crawford (back end), Kevin Musiorski (back end)
Form ID (if different from app name, NA otherwise): `NA`
URL: `{root url}/va-payment-history/payments`


# Background
Veterans receive lots of payments for the various benefits they receive from the VA. This app allows Veterans to see what payments have been made to them as well as some basic information about those payments.

## How the app works for the user
When the user lands on the View Payments page they will either have payments or not. If they have no payments they will be shown a message that we have no payments on file for them. If they do have payments they will be shown a list of all the payments we have on file for them. If the user does have payments they will be split into two lists, one is payments that the Veteran has received, the second is payments that have been returned to the VA.

The page also includes some static content about payments with helpful links.

> There is a third possibility when the user lands on the page, that we had an error looking up their payments. If there is an error they will be shown a message about the error.

## The front end code
The front end is split up into a few basic components that are inside a container that acts as a wrapper and connects the app to our Redux code. The container, located at [/containers/App.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/a4babda01dac9cbb30feded94e92ea8f557b69be/src/applications/disability-benefits/view-payments/containers/App.jsx#L1), simply takes the main components and wraps them in a `<DowntimeNotification />` from the platform in case BGS is down (which we use as the data source on the back end). This is then wrapped in a `<RequiredLoginView />` component from the platform that simply requires the user to log in to view their payments. You will also notice the `mapStateToProps` call where we tie the app into Redux.

### Payment lists
The meat inside the `App.js` container is the `<ViewPaymentsLists />` located at `/components/view-payments-lists/ViewPaymentsLists.jsx`. This component is responsible for rendering most of the content on the page. It begins with a call to [getAllPayments](https://github.com/department-of-veterans-affairs/vets-website/blob/a4babda01dac9cbb30feded94e92ea8f557b69be/src/applications/disability-benefits/view-payments/actions/index.js#L20) inside a `componentDidMount` which calls the action from Redux passed in through `mapDispatchToProps`. This action calls the `/profile/payment_history` endpoint and gets the payments for the Veteran.

Once we retrieve the payments for the veteran we call two methods, [buildReturnedPaymentListContent](https://github.com/department-of-veterans-affairs/vets-website/blob/a4babda01dac9cbb30feded94e92ea8f557b69be/src/applications/disability-benefits/view-payments/components/view-payments-lists/ViewPaymentsLists.jsx#L32) and [buildPaymentListContent](https://github.com/department-of-veterans-affairs/vets-website/blob/a4babda01dac9cbb30feded94e92ea8f557b69be/src/applications/disability-benefits/view-payments/components/view-payments-lists/ViewPaymentsLists.jsx#L66) the first of which builds the table of returned payments for the veteran and the second of which builds the table of payments the Veteran has received. In each of these methods we check to see if there are payments for each respective list and if there are we render them in a `<Payments />` component. If there are no payments for either list then we render a message about it inside an `<va-alert />` component from the platform.

Aside from the call to `getAllPayments`, everything above is called inside the `render` method where we build the full page of content based on the logic above. You will also notice that it is inside the `render` method where we check if the app is loading, if it is we show a `<LoadingIndicator />` from the platform, as well as check if there was an error for the whole page and if there is we render a `<va-alert />` component from the platform.

### The payments component
When we render payments for the Veteran we do it using the `<Payments />` component located in [/components/view-payments-lists/payments/Payments.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/a4babda01dac9cbb30feded94e92ea8f557b69be/src/applications/disability-benefits/view-payments/components/view-payments-lists/payments/Payments.jsx#L1). Inside this component we first set a little bit of state about that particular payments list. We then call `handleLoadData` inside the `componentDidMount` method. We paginate the payments for the Veteran so before we actually load the payments into a list we split them into an array of arrays. Each one of these arrays represents a page of payments inside the pagination. We then load the paginated data into state as well as the first page of data by itself and the number of pages of data.

## Callouts on how the front end works
> Any special or interesting aspects of how the front end works should be detailed here. This is meant to be read by developers that need to make sense of these special or interesting aspects of your code without you present so write them with as much code detail as possible to achieve good clarity.

## The back end code
> This is for a detailed description of the back end code for your app. Good things to put here are the basic folder and file structure as well as a short description of why this folder and file structure was used. Also be sure to callout any interesting folder or file usage that might confuse a future developer.


## Callouts on how the front end works
> Any special or interesting aspects of how the back end works should be detailed here. This is meant to be read by developers that need to make sense of these special or interesting aspects of your code without you present so write them with as much code detail as possible to achieve good clarity.
