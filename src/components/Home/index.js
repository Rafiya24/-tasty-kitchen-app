import {Component} from 'react'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {BsFilterLeft} from 'react-icons/bs'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const sortByOptions = [
  {
    id: 0,
    displayText: 'Highest',
    value: 'Highest',
  },
  {
    id: 2,
    displayText: 'Lowest',
    value: 'Lowest',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  carouselInProgress: 'CAROSELINPROGRESS',
  carouselInSuccess: 'CAROUSELINSUCCESS',
  restaurentsListInProgress: 'RESTAURENTSLISTINPROGRESS',
  restaurentsListInSuccess: 'RESTAURENTSLISTINSUCCESS',
}

const token = Cookies.get('jwt_token')

class Home extends Component {
  state = {
    carouselApiStatus: apiStatusConstants.initial,
    restaurentsApiStatus: apiStatusConstants.initial,
    carouselsList: [],
    restaurentsList: [],
    activeOption: sortByOptions[1].value,
    activePage: 1,
    totalRetaurents: 0,
  }

  componentDidMount = () => {
    this.getCarousels()
    this.getPopularRestaurents()
  }

  getCarousels = async () => {
    const url = 'https://apis.ccbp.in/restaurants-list/offers'
    const options = {
      headers: {Authorization: `Bearer ${token}`},
    }

    this.setState({carouselApiStatus: apiStatusConstants.carouselInProgress})

    const response = await fetch(url, options)
    const data = await response.json()
    const fetchedData = data.offers.map(each => ({
      id: each.id,
      imageUrl: each.image_url,
    }))
    if (response.ok) {
      this.setState({
        carouselsList: fetchedData,
        carouselApiStatus: apiStatusConstants.carouselInSuccess,
      })
    }
  }

  getPopularRestaurents = async () => {
    const {activeOption, activePage} = this.state
    const limit = 9
    const offset = (activePage - 1) * limit

    this.setState({
      restaurentsApiStatus: apiStatusConstants.restaurentsListInProgress,
    })

    const url = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${limit}&sort_by_rating=${activeOption}`

    const options = {
      headers: {Authorization: `Bearer ${token}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()

    const fetchedData = data.restaurants.map(each => ({
      imageUrl: each.image_url,
      id: each.id,
      name: each.name,
      rating: each.user_rating.rating,
      totalReviews: each.user_rating.total_reviews,
      menuType: each.menu_type,
      cuisine: each.cuisine,
    }))
    const {total} = data
    if (response.ok) {
      this.setState({
        restaurentsList: fetchedData,
        restaurentsApiStatus: apiStatusConstants.restaurentsListInSuccess,
        totalRetaurents: total,
      })
    }
  }

  // testid="restaurants-offers-loader"
  renderCrouselLoadingView = () => (
    <div className="home-loader-container">
      <Loader type="Oval" color="#F7931E" height="50" width="50" />
    </div>
  )

  // testid="restaurants-list-loader"
  renderListsLoadingView = () => (
    <div className="home-loader-container">
      <Loader type="Oval" color="#F7931E" height="50" width="50" />
    </div>
  )

  renderCarousels = () => {
    const {carouselsList, carouselApiStatus} = this.state
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }
    switch (carouselApiStatus) {
      case apiStatusConstants.carouselInProgress:
        return this.renderCrouselLoadingView()
      case apiStatusConstants.carouselInSuccess:
        return (
          <div>
            <Slider {...settings}>
              {carouselsList.map(each => (
                <div key={each.id}>
                  <img
                    src={each.imageUrl}
                    alt="offer"
                    className="carousel-item"
                  />
                </div>
              ))}
            </Slider>
          </div>
        )
      default:
        return null
    }
  }

  renderRestaurents = () => {
    const {restaurentsApiStatus, restaurentsList} = this.state
    switch (restaurentsApiStatus) {
      case apiStatusConstants.restaurentsListInProgress:
        return this.renderListsLoadingView()
      case apiStatusConstants.restaurentsListInSuccess:
        return restaurentsList.map(each => (
          // testid="restaurant-item"
          <li key={each.id}>
            <Link to={`/restaurant/${each.id}`} className="list-item-container">
              <div>
                <img
                  src={each.imageUrl}
                  className="restaurent-img"
                  alt="restaurant"
                />
              </div>
              <div>
                <h1 className="restaurents-name">{each.name}</h1>
                <p className="restaurent-menu-type">{each.cuisine}</p>
                <div className="restaurent-rating-container">
                  <AiFillStar className="star" />
                  <p className="restaurnet-rating">{each.rating}</p>
                  <p className="restaurent-reviews">({each.totalReviews})</p>
                </div>
              </div>
            </Link>
          </li>
        ))
      default:
        return null
    }
  }

  onChangeSorting = event => {
    this.setState(
      {activeOption: event.target.value},
      this.getPopularRestaurents,
    )
  }

  onClickLeftPagination = () => {
    const {activePage} = this.state
    if (activePage === 1) {
      return
    }
    this.setState(
      prevState => ({
        activePage: prevState.activePage - 1,
      }),
      this.getPopularRestaurents,
    )
  }

  onClickRightPagination = () => {
    const {totalRetaurents, activePage} = this.state
    const limit = 9

    const maxPage = Math.ceil(totalRetaurents / limit)
    if (activePage === maxPage) {
      return
    }
    this.setState(
      prevState => ({
        activePage: prevState.activePage + 1,
      }),
      this.getPopularRestaurents,
    )
  }

  render() {
    const {activeOption, activePage, totalRetaurents} = this.state
    // testid="pagination-left-button" testid="active-page-number" testid="pagination-right-button"
    const limit = 9
    return (
      <div>
        <Header />
        <div className="home-container">
          <div className="carousel-container">{this.renderCarousels()}</div>
          <div className="popular-restaurants-container">
            <div className="sorting-heading">
              <div>
                <h1 className="Popular-restaurants-heading">
                  Popular Restaurants
                </h1>
                <p className="Popular-restaurant-description">
                  Select Your favourite restaurant special dish and make your
                  day happy...
                </p>
              </div>
              <div className="sorting-container">
                <BsFilterLeft className="sorter" />
                <p className="sort-by">Sort By</p>
                <select
                  value={activeOption}
                  className="select"
                  onChange={this.onChangeSorting}
                >
                  {sortByOptions.map(each => (
                    <option key={each.id} value={each.value}>
                      {each.displayText}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="hr-line" />
            <ul className="ul-restaurants-list">{this.renderRestaurents()}</ul>
            <div className="paginations-container">
              <button
                type="button"
                className="page-btn"
                onClick={this.onClickLeftPagination}
              >
                <FaChevronLeft />
              </button>
              <p>
                <span>{activePage}</span> of
                {Math.ceil(totalRetaurents / limit)}
              </p>
              <button
                type="button"
                className="page-btn"
                onClick={this.onClickRightPagination}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
