App Name: `Certificate of Eligibility (COE) Status App`
Active engineers: 
Form ID (if different from app name, NA otherwise): `NA`
URL: `{root url}/housing-assistance/home-loans/check-coe-status/your-coe`


# Background
When a Veteran wants to get a VA backed home loan the VA can provide them with something called a "Certificate of Eligibility" (COE). This certificate does not approve them for a specific dollar amount but rather lets the Veteran's chosen lender know that they are in fact able to get a VA backed home loan.

When a veteran wants to recieve a COE they can come to this page and we can make a call to the upstream data service LGY and they can send us a determination of if the Veteran is automatically approved for a COE. If they are automatically approved then we can provide them a link to download that COE. Alternatively if the Veteran applied for a COE then the call we make the LGY serivice will return to us the status of that COE application that the Veteran has in progress.

## How the app works for the user
When a Veteran first lands on the page we make the initial call to the LGY service to get the status of the COE for the Veteran. We then show content relevent to that Veteran based on the status that comes back from LGY, so for example if the Veteran is automatically approved for a COE we show them a message that says that they are automatically approved as well as a link to download the COE as a PDF.

## The front end code
The front end for the COE status app is broken up into `containers` and `components` with the main entry point of the app being `app-entry.jsx`. Inside the `containers` directory there is a file called `App.js` which housese the main logic for the front end, everything else are components rendered inside this main `App.js` file. We use Redux to make the call to the LGY endpoints for the status of the COE, those are one level out in a `/shared` folder since they are used in this app and in the form app.

Inside `App.js` we import the Redux actions and based on the data returned by the LGY service called in those Redux actions we enter into a block of logic. That logic first tests if the call to LGY is pending and if it is it returns a loading indicator. Once the call to LGY is successful we enter into a switch statement based on the data returned by the LGY service. 


### Statuses
The LGY service that we call when a Veteran lands on the status app page returns to us two pieces of data that we then use to determine a "status" for the COE of that Veteran. The idea behind the LGY service is to make an automatic determination for the Veteran for if they are eligible to recieve a COE. The two pieces of data are used in combination in the logic of the back end controller in vets-api. The two piees of data are -

> 1. A string returned to us in the body of our request to the LGY service for 'status'
> 2. A 200 or 404 http response for any current application the Veteran may have in progress for a COE

The string for the status that is returned by LGY is pretty simple, it can either be one of these -

1. `ELIGIBLE` - meaning that the Veteran is in fact eligible for an automatic approval and can get a COE
2. `UNABLE_TO_DETERMINE_AUTOMATICALLY` - meaning that the Veteran is not eligible for an automatic approval but can apply for a COE manually
3. `NOT_ELIGIBLE` - meaning that the Veteran has been denied approval for a COE
4. `PENDING` - meaning that the Veteran has an application for a COE currently pending

The different statuses that can be returned are also combined with the http response for a current application in a set of logic and what is returned based on that logic is what we used on the front end. In vets-api the file with the logic for this is the service and is available at `vets-api/app/lib/lgy/service.rb` and looks like this -

```ruby
    def coe_status
      if get_determination.body['status'] == 'ELIGIBLE' && get_application.status == 404
        { status: 'eligible', reference_number: get_determination.body['reference_number'] }
      elsif get_determination.body['status'] == 'UNABLE_TO_DETERMINE_AUTOMATICALLY' && get_application.status == 404
        { status: 'unable-to-determine-eligibility', reference_number: get_determination.body['reference_number'] }
      elsif get_determination.body['status'] == 'ELIGIBLE' && get_application.status == 200
        { status: 'available', application_create_date: get_application.body['create_date'],
          reference_number: get_determination.body['reference_number'] }
      elsif get_determination.body['status'] == 'NOT_ELIGIBLE'
        { status: 'denied', application_create_date: get_determination.body['determination_date'],
          reference_number: get_determination.body['reference_number'] }
      elsif get_determination.body['status'] == 'PENDING' && get_application.status == 404
        # Kelli said we'll never having a pending status w/o an application, but LGY sqa data is getting hand crafted
        { status: 'pending', reference_number: get_determination.body['reference_number'] }
      elsif get_determination.body['status'] == 'PENDING' && get_application.body['status'] == 'SUBMITTED'
        # SUBMITTED & RECEIVED ARE COMBINED ON LGY SIDE
        { status: 'pending', application_create_date: get_application.body['create_date'],
          reference_number: get_determination.body['reference_number'] }
      elsif get_determination.body['status'] == 'PENDING' && get_application.body['status'] == 'RETURNED'
        { status: 'pending-upload', application_create_date: get_application.body['create_date'],
          reference_number: get_determination.body['reference_number'] }
      end
    end
```

Once we determine the status for the Veteran's COE we then show content on the page specific to that status. These pieces of content are held inside `components/statuses`. If the Veteran is in fact eligible for an automatic COE or has had their application for a COE approved we also show them a link to download their COE. This link makes an API call to the LGY service and they then stream the PDF for the COE back to us.

In the last instance of the status logic above you will notice that the status returned to us is one of `pending-upload`, this means that the Veteran has an application in progress but that the VA needs further documentation from the Veteran. In this instance we include the document uploader inside `components/DocumentUploader` in the content shown to the Veteran.

### Documents
In many cases the Veteran will have documents that have been sent either to them from the VA or sent by them to the VA. When the status app loads we also make a call to a `coe` controller action at `/coe/documents` to retreive a list of the documents that have been sent by or to the Veteran regarding their COE and list them out. We also provide links to those documents that the Veteran can use to download the document. When the Veteran clicks those links we make an API call to the LGY service and they then stream the PDF of that document back to us.


## Mocking the `/coe/` endpoint in vets-api
When developing locally, vets-api is generally not set up to access the COE status from the upstream data service LGY.

To mock the COE app we need to go to the controller at `app/controllers/v0/coe_controller.rb` and replace this code - 

```ruby
 # def status
#   coe_status = lgy_service.coe_status
#   render json: { data: { attributes: coe_status } }, status: :ok
# end

# def download_coe
#   coe_url = lgy_service.coe_url
#   render json: { data: { attributes: { url: coe_url } } }, status: :ok
# end

# def documents
#   documents = lgy_service.get_coe_documents

#   # Documents should be sorted from most to least recent
#   sorted = documents.body.sort_by { |doc| doc['create_date'] }.reverse

#   render json: { data: { attributes: sorted } }, status: :ok
# end

```

With this code -

```ruby
# COE_ELIGIBILITY_STATUS = {
#   available: 'available',
#   denied: 'denied',
#   eligible: 'eligible',
#   ineligible: 'ineligible',
#   unableToDetermine: 'unable-to-determine-eligibility',
#   pending: 'pending',
#   pendingUpload: 'pending-upload',
# }
def status
    coe_status = { status: 'available', reference_number: '17923279', application_create_date: 1645565285000 }
    render json: { data: { attributes: coe_status } }, status: :ok
end

def download_coe
  # coe_url = lgy_service.coe_url
  coe_url = 'https://www.google.com'
  render json: { data: { attributes: { url: coe_url } } }, status: :ok
end

def documents
  # documents = lgy_service.get_coe_documents
  documents = {
    :body => [
    {'id':23218851,'document_type':'.pdf','create_date':1645565285000,'description':'Discharge or separation papers (DD214) 1'},
    {'id':23218852,'document_type':'.pdf','create_date':1645665285000,'description':'Discharge or separation papers (DD214) 2'}
  ]}

  sorted = documents[:body].sort_by { |doc| doc['create_date'] }.reverse

  render json: { data: { attributes: sorted } }, status: :ok
end
```

that will return the status of `available`, you can change that if you need to see a different status referenced above in how the app works.
It will also return two documents for that endpoint.





