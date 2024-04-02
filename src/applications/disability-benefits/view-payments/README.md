# View Payments

Veterans receive lots of payments for the various benefits they receive from the VA. This app allows Veterans to see what payments have been made to them as well as some basic information about those payments.

**Active engineers**: Micah Chiang (front end), Jesse Cohn (front end), Kathleen Crawford (back end), Kevin Musiorski (back end)

Form ID (if different from app name, NA otherwise): `NA`
URL: `{root url}/va-payment-history/payments`

## How the app works for the user

When the user lands on the View Payments page they will either have payments or not. If they have no payments they will be shown a message that we have no payments on file for them. If the user does have payments they will be split into two lists, one is payments that the Veteran has received, the second is payments that have been returned to the VA. It is worth noting that not ever Veteran that has recieved payments will also have returned payments.

The page also includes some static content about payments with helpful links.

> There is a third possibility when the user lands on the page, that we had an error looking up their payments. If there is an error they will be shown a message about the error.

## The Front-End Code

The front end is split up into a few basic components that are inside a container that acts as a wrapper and connects the app to our Redux code. The container, located at [/containers/App.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/a4babda01dac9cbb30feded94e92ea8f557b69be/src/applications/disability-benefits/view-payments/containers/App.jsx#L1), simply takes the main components and wraps them in a `<DowntimeNotification />` from the platform in case BGS is down (which we use as the data source on the back end). This is then wrapped in a `<RequiredLoginView />` component from the platform that simply requires the user to log in to view their payments. You will also notice the `mapStateToProps` call where we tie the app into Redux.

### Payment Lists

The meat inside the `App.js` container is the [<ViewPaymentsLists />](https://github.com/department-of-veterans-affairs/vets-website/blob/dbbf4dfdc89a682e62aad01f1773021a28209cdc/src/applications/disability-benefits/view-payments/components/view-payments-lists/ViewPaymentsLists.jsx#L1). This component is responsible for rendering most of the content on the page. It begins with a call to [getAllPayments](https://github.com/department-of-veterans-affairs/vets-website/blob/a4babda01dac9cbb30feded94e92ea8f557b69be/src/applications/disability-benefits/view-payments/actions/index.js#L20) inside a `componentDidMount` which calls the action from Redux passed in through `mapDispatchToProps`. This action calls the `/profile/payment_history` endpoint and gets the payments for the Veteran.

Once we retrieve the payments for the veteran we call two methods, [buildReturnedPaymentListContent](https://github.com/department-of-veterans-affairs/vets-website/blob/a4babda01dac9cbb30feded94e92ea8f557b69be/src/applications/disability-benefits/view-payments/components/view-payments-lists/ViewPaymentsLists.jsx#L32) and [buildPaymentListContent](https://github.com/department-of-veterans-affairs/vets-website/blob/a4babda01dac9cbb30feded94e92ea8f557b69be/src/applications/disability-benefits/view-payments/components/view-payments-lists/ViewPaymentsLists.jsx#L66) the first of which builds the table of returned payments for the veteran and the second of which builds the table of payments the Veteran has received. In each of these methods we check to see if there are payments for each respective list and if there are we render them in a `<Payments />` component. If there are no payments for either list then we render a message about it inside an `<va-alert />` component from the platform.

Aside from the call to `getAllPayments`, everything above is called inside the `render` method where we build the full page of content based on the logic above. You will also notice that it is inside the `render` method where we check if the app is loading, if it is we show a `<va-loading-indicator />` from the platform, as well as check if there was an error for the whole page and if there is we render a `<va-alert />` component from the platform.

### The Payments Component

When we render payments for the Veteran we do it using the `<Payments />` component located in [/components/view-payments-lists/payments/Payments.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/a4babda01dac9cbb30feded94e92ea8f557b69be/src/applications/disability-benefits/view-payments/components/view-payments-lists/payments/Payments.jsx#L1). Inside this component we first set a little bit of state about that particular payments list. We then call `handleLoadData` inside the `componentDidMount` method. We paginate the payments for the Veteran so before we actually load the payments into a list we split them into an array of arrays. Each one of these arrays represents a page of payments inside the pagination. We then load the paginated data into state as well as the first page of data by itself and the number of pages of data.

## The Back-End Code

When the front end calls [/profile/payment_history](https://github.com/department-of-veterans-affairs/vets-api/blob/be3a39e6054afd8c6a2cbb61cfd215421a8a718a/app/controllers/v0/profile/payment_history_controller.rb#L1) in the back end we call the `new` method from the BGS People Service and assign the result, which is the Veteran's VA file number, to a new variable called `person`. We then use that `person` variable to call the `new` method from the BGS Payment Service and assign the result, a list of payments for the Veteran, to a new array of objects called `response`. We then send that response back to the front end using the `VetPaymentHistorySerializer`.

## How to run locally

### Run vets-api locally

1. Open up the project in **VSCode** or in a **terminal instance** by cding into the vets-api project.
2. Mock the `profile/payment_history` endpoint in vets-api
   - When developing locally, vets-api is not able to properly access BGS to retrieve payment data.
    In order to retrieve view payments locally, we can create mock data for vets-api to return by
    replacing the `payment_history` method in `/app/services/bgs/payment_service.rb` with the following:

    ```ruby
    def payment_history
        {
            payments: {
                payment: [
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-04-01T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Direct Deposit',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-04-02T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Direct Deposit',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-04-03T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Direct Deposit',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-04-04T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Paper Check',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-12-01T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Direct Deposit',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-04-05T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Paper Check',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-05-06T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Paper Check',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-06-02T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Direct Deposit',
                        address_eft: {
                            account_numbe: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-07-03T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Direct Deposit',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-08-04T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Paper Check',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-09-05T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Direct Deposit',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-07-03T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Direct Deposit',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    },
                    {
                        payment_amount: 3261.10,
                        payment_date: '2019-07-04T00:00:00.000-06:00',
                        payment_type: 'Compensation & Pension - Recurring',
                        payment_method: 'Direct Deposit',
                        address_eft: {
                            account_number: '123456',
                            account_type: 'Checking',
                            bank_name: 'BANK OF AMERICA, N.A.',
                            routing_number: '111000025'
                        },
                        account_number: '****1234'
                    }
                ]
            }
        }
    rescue => e
      report_error(e)
      empty_response if e.message.include?('No Data Found')
    end
    ```

> [!NOTE]
> The above will return an array of payments, but it will not include any returned payments, so when viewing the > page at `/va-payment-history/payments`, you will only see the `Payments you received` table.

3. Once in the vets-api project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

    ```code block
    bundle install
    ```

   - Run vets-api locally
  
    ```code block
    foreman start -m all=1,clamd=0,freshclam=0
    ```

### Run vets-website locally

1. Open up the project in **VSCode** or in a **terminal instance** by cding into the vets-website project.
2. Take a look at [src/applications/disability-benefits/view-payments/manifest.json](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/disability-benefits/view-payments/manifest.json) to see what the service name is that you’ll need for the vets-website yarn watch command and for the url

   - Service Name: entryName
   - Localhost Url: rootUrl (EX: <http://localhost:3001/va-payment-history/payments>)

3. Once in the vets-website project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

    ```code block
    yarn install
    ```

   - Run vets-website locally
  
    ```code block
    yarn watch --env entry=auth,view-payments,static-pages,login-page,terms-of-use,verify
    ```

### How to login into localhost and view the claim status tool

1. Go to <http://localhost:3001/sign-in/mocked-auth>
2. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
3. Select a profile from the drop down (EX: <vets.gov.user+228@gmail.com>) and click the ‘Continue signing in’ button.
4. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/va-payment-history/payments>  and you will be directed to the View Payments service.
