const clientId = 'ty3g8lNGNJx5Bbsc-DFa2w';
const clientSecret = '30yeg8rpOObF0Si6O4uvOouWeDVKq5hcjTq3E96toT7Pj0mC8ZmVgmQg21uVmt5d';
let accessToken;

export const Yelp = {
  getAccessToken() {
    if (accessToken) {
      return new Promise(resolve => resolve(accessToken));
    }
    return fetch(
      `https://cors-anywhere.herokuapp.com/https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      {method: 'POST'}
    ).then(
      response => response.json()
    ).then(
      jsonResponse =>  accessToken = jsonResponse.accessToken
    )
  },

  search(term, location, sortBy) {
    return Yelp.getAccessToken().then(() => {
      fetch(
        `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`,
        {headers: {
          Authorization: `Bearer ${accessToken}`
        }}
      )
    }).then(
      response => response.json()
    ).then(jsonResponse => {
      if (jsonResponse.business) {
        return jsonResponse.business.map(
          business => {return {
            id: business.id,
            imageSrc: business.image_url,
            name: business.name,
            address: business.location.address,
            city: business.location.city,
            state: business.location.state_code,
            zipCode: business.location.postal_code,
            category: business.categories,
            rating: business.rating,
            reviewCount: business.review_count
          }}
        )
      }
    });
  }
};
