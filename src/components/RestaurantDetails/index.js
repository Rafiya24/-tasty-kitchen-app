import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {FaRupeeSign} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Counter from '../Counter'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESSS',
  success: 'SUCCESS',
}
class RestaurantDetails extends Component {
  state = {
    details: [],
    fooditemsList: [],
    apiStatus: apiStatusConstants.initial,
    cartData: [],
  }

  componentDidMount = () => {
    this.getDetails()
    const savedCart = JSON.parse(localStorage.getItem('cartData')) || []
    const cleanedCart = savedCart.filter(item => item !== null)
    if (savedCart) {
      this.setState({cartData: cleanedCart})
    }
  }

  getDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/restaurants-list/${id}`
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${token}`},
    }

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const response = await fetch(url, options)
    const data = await response.json()
    const fetchedData = {
      costForTwo: data.cost_for_two,
      cuisine: data.cuisine,
      id: data.id,
      imageUrl: data.image_url,
      itemsCount: data.items_count,
      location: data.location,
      name: data.name,
      opensAt: data.opens_at,
      rating: data.rating,
      reviewsCount: data.reviews_count,
    }
    const foodItems = data.food_items.map(each => ({
      id: each.id,
      cost: each.cost,
      foodType: each.food_type,
      imageUrl: each.image_url,
      name: each.name,
      rating: each.rating,
      quantity: 0,
    }))
    if (response.ok) {
      this.setState({
        details: fetchedData,
        fooditemsList: foodItems,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.initial})
    }
  }

  // 83 testid="restaurant-details-loader"
  renderLoadingView = () => (
    <div className="details-loader-container">
      <Loader type="Oval" color="#F7931E" height="50" width="50" />
    </div>
  )

  renderAboutRestaurant = () => {
    const {details} = this.state
    const {
      imageUrl,
      costForTwo,
      cuisine,
      location,
      name,
      rating,
      reviewsCount,
    } = details
    return (
      <div className="about-restaurant">
        <div className="sub-about-container">
          <div>
            <img src={imageUrl} className="restaurant-image" alt="restaurant" />
          </div>

          <div>
            <h1 className="restaurent-heading">{name}</h1>
            <p className="restaurant-cuisine">{cuisine}</p>
            <p className="restaurant-location">{location}</p>
            <div className="ratings-count">
              <div>
                <div className="restaurant-ratings-container">
                  <AiFillStar className="restaurant-star" />
                  <p className="restaurant-rating">{rating}</p>
                </div>
                <p className="ratings-costs-para">{reviewsCount}+ Ratings</p>
              </div>
              <div className="vertical-line" />
              <div>
                <div className="restaurant-ratings-container">
                  <p className="restaurant-rating">{costForTwo}</p>
                </div>
                <p className="ratings-costs-para">Cost for two</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  onClickAdd = product => {
    const {cartData} = this.state
    const cart = [...cartData]
    const exisistingItem = cart.find(cartItem => cartItem.id === product.id)
    if (exisistingItem) {
      exisistingItem.quantity += 1
    } else {
      cart.push({...product, quantity: 1})
    }

    this.setState({cartData: cart})

    localStorage.setItem('cartData', JSON.stringify(cart))
  }

  decreaseQuantity = itemId => {
    const {cartData} = this.state
    const updatedCart = cartData
      .map(item =>
        item.id === itemId ? {...item, quantity: item.quantity - 1} : item,
      )
      .filter(each => each.quantity > 0)

    this.setState({cartData: updatedCart})
    localStorage.setItem('cartData', JSON.stringify(updatedCart))
  }

  increaseQuantity = itemId => {
    const {cartData} = this.state
    const updatedCart = cartData.map(item => {
      if (item.id === itemId) {
        return {...item, quantity: item.quantity + 1}
      }
      return item
    })

    this.setState({cartData: updatedCart})
    localStorage.setItem('cartData', JSON.stringify(updatedCart))
  }

  // 188 testid="foodItem"
  renderRestaurantDetails = () => {
    const {apiStatus, fooditemsList, cartData} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return (
          <>
            {this.renderAboutRestaurant()}
            <ul className="dish-items-ul-container">
              {fooditemsList.map(product => (
                <li key={product.id} className="dish-item-container">
                  <div>
                    <img
                      alt="product-images"
                      src={product.imageUrl}
                      className="dish-image"
                    />
                  </div>
                  <div>
                    <h1 className="dish-name">{product.name}</h1>
                    <div className="starts-rupees-container">
                      <div className="dish-cost">
                        <FaRupeeSign />
                        <p>{product.cost}</p>
                        <p>.00</p>
                      </div>

                      <div className="dish-rating">
                        <AiFillStar className="dish-star" />
                        <p>{product.rating}</p>
                      </div>
                    </div>
                    {cartData.some(each => each.id === product.id) ? (
                      <Counter
                        product={product}
                        increaseQuantity={this.increaseQuantity}
                        decreaseQuantity={this.decreaseQuantity}
                        quantity={
                          cartData.find(each => each.id === product.id).quantity
                        }
                      />
                    ) : (
                      product.quantity === 0 && (
                        <button
                          type="button"
                          className="dish-add-btn"
                          onClick={() => {
                            this.onClickAdd(product)
                          }}
                        >
                          Add
                        </button>
                      )
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderRestaurantDetails()}
        <Footer />
      </>
    )
  }
}

export default RestaurantDetails
