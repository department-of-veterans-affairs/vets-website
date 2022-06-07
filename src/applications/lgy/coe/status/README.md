App Name: `Certificate of Eligibility (COE) Status App`
Active engineers: 
Form ID (if different from app name, NA otherwise): `NA`
URL: `{root url}/housing-assistance/home-loans/check-coe-status/your-coe`


# Background
TBD

## How the app works for the user
TBD

## The front end code
TBD

## The back end code
TBD

## Mocking the `/coe/` endpoint in vets-api
When developing locally, vets-api is generally not set up to access the COE status from the upstream data service LGY.

### COE Status

To mock the COE status we need to go to the controller at `app/controllers/v0/coe_controller.rb` and replace this code - 

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





