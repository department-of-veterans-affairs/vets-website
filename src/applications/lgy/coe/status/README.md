App Name: `Certificate of Eligibility (COE) Status App`
Active engineers: 
Form ID (if different from app name, NA otherwise): `NA`
URL: `{root url}/housing-assistance/home-loans/check-coe-status/your-coe`


# Background
When a Veteran wants to get a VA backed home loan the VA can provide them with something called a "Certificate of Eligibility" (COE). This certificate does not approve them for a specific dollar amount but rather lets the Veteran's chosen lender know that they are in fact able to get a VA backed home loan.

When a veteran wants to recieve a COE they can come to this page and we can make a call to the upstream data service LGY and they can send us a determination of if the Veteran is automatically approved for a COE. If they are automatically approved then we can provide them a link to download that COE. Alternatively if the Veteran applied for a COE then the call we make the LGY serivice will return to us the status of that COE application that the Veteran has in progress.

## How the app works for the user
When a Veteran first lands on the page we make the initial call to the LGY service to get the status of the COE for the Veteran. We then show content relevent to that Veteran based on the status that comes back from LGY, so for example if the Veteran is automatically approved for a COE we show them a message that says that they are automatically approved as well as a link to download the COE as a PDF.

### Statuses


## The front end code
TBD

## The back end code
TBD

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





