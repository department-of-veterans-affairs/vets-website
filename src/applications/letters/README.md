# Letters

To receive some benefits, Veterans need a letter proving their status. This service allows VA users to access and download their VA Benefit Summary Letter (sometimes called a VA award letter) and other benefit letters and documents online.

## Initial set up steps to run locally

You'll only need to do these steps once.

1. You will need AWS access first in order to use this service locally.
   - Go to this [link](https://depo-platform-documentation.scrollhelp.site/developer-docs/set-up-your-aws-account#SetupyourAWSAccount-Setupprogrammaticaccess) and follow the instructions under **How to create a new file**.

> [!TIP]
> When on Step 5 you can create a credentials folder by doing the following:
>
>   ```sh
>   // Create an aws folder
>   mkdir ~/.aws
>
>   // Create a credentials file
>   touch ~/.aws/credentials
>
>   // Use vi to update the credentials file
>   // Take the below code and fill it in with your AWS credentials and then save
>   [default]
>   region = us-gov-west-1
>   aws_access_key_id = <ACCESS_KEY>
>   aws_secret_access_key = <SECRET_KEY>
>   ```

2. Clone the [devops repo](https://github.com/department-of-veterans-affairs/devops)

3. If you dont already have Docker installed make sure to download [Docker](https://www.docker.com/get-started/) and run it

4. If you havent added jq or awscli then brew install them

  ```sh
  brew install jq
  brew install awscli
  ```

## How to run locally

### Create ssh port forwarding

1. In a Terminal instance go into devops/utilities

  ```sh
  cd devops/utilities
  ```

2. Generate temporary credentials for AWS.

> [!TIP]
> Replace the User Name with your AWS user name ex: Jim.Frank
> Replace the MFA Code with the 6 digit code that you see on your MFA app for AWS

  ```sh
  source ./issue_mfa.sh <User Name> <MFA Code>
  ```

3. Get a list of the current forward proxy instances in staging

> [!TIP]
> The private ip addresses will be used below and **q key** with the **enter key** lets you exit
>
> EX:
> | Instance ID | Private Ip | Name |
> | i-00c543a63d6753411 | 10.247.35.112 | dsva-vagov-staging-deployment-vagov-staging-fwdproxy-20240312-201722-asg |

  ```sh
  ./ssm.sh fwdproxy staging
  ```

4. Create the ssh tunnel

> [!TIP]
> In the IP Address replace the . with -
> EX:10.247.35.112 => 10-247-35-112

> [!TIP]
> 4433 is the forward proxy port for vet360 and it can be replaced with any other ports

  ```sh
  ssh -L 4447:localhost:4433 ip-<IP Address>.us-gov-west-1.compute.internal
  ```

> [!TIP]
> When it asks you "Are you sure you want to continue connecting?" type yes

> [!NOTE]
> If you have issues with the above command then run the socks command
> ```vtk socks on```

### Run vets-api locally

1. Open up the project in **VSCode** or in a **terminal instance** by cding into the vets-api project.
2. Make sure that **config/settings.local.yml** has the following code in it...

   ```sh
    # lighthouse
    lighthouse: 
      letters_generator:
        use_mocks: true

    # vet360
    vet360:
      url: https://localhost:4447
   ```

3. Go to **lib/va_profile/configuration.rb** and inside the connection method add to following...

   ```sh
   faraday.ssl.verify = false
   ```

4. Once in the vets-api project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

    ```sh
    bundle install
    ```

   - Run vets-api locally
  
    ```sh
    foreman start -m all=1,clamd=0,freshclam=0
    ```

### Run vets-website locally

1. Open up the project in **VSCode** or in a **terminal instance** by cding into the vets-website project.
2. Take a look at [src/applications/letters/manifest.json](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/letters/manifest.json) to see what the service name is that you’ll need for the vets-website yarn watch command and for the url

   - Service Name: entryName
   - Localhost Url: rootUrl (EX: <http://localhost:3001/records/download-va-letters/letters/letter-list>)

3. Once in the vets-website project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

    ```sh
    yarn install
    ```

   - Run vets-website locally
  
    ```sh
    yarn watch --env entry=auth,letters,static-pages,login-page,terms-of-use,verify
    ```

### Verify Feature Toggle is enabled

Go to <http://localhost:3000/flipper/features/bcas_letters_use_lighthouse> and make sure the feature toggle **bcas_letters_use_lighthouse** is on.

### How to login into localhost and view the letter service

1. Go to <http://localhost:3001/sign-in/mocked-auth>
2. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
3. Select a profile from the drop down (EX: <vets.gov.user+228@gmail.com>) and click the ‘Continue signing in’ button.
4. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/records/download-va-letters/letters/letter-list>  and you will be directed to the Letters service.
