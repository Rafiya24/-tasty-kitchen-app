import {Component} from 'react'
import {FaRupeeSign} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
}

class Cart extends Component {
  state = {
    cartData: [],
    apiStatus: apiStatusConstants.initial,
    isPlaceOrderClcked: false,
  }

  componentDidMount = () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const savedCart = JSON.parse(localStorage.getItem('cartData'))
    if (savedCart) {
      this.setState({
        cartData: savedCart,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  onClickPlaceOrder = () => {
    this.setState({isPlaceOrderClcked: true})
  }

  increaseQuantity = id => {
    const {cartData} = this.state
    const updatedCart = cartData.map(item => {
      if (item.id === id) {
        return {...item, quantity: item.quantity + 1}
      }
      return item
    })
    this.setState({cartData: updatedCart})
    localStorage.setItem('cartData', JSON.stringify(updatedCart))
  }

  decreaseQuantity = id => {
    const {cartData} = this.state
    let updatedCart = cartData.map(item => {
      if (item.id === id) {
        return {...item, quantity: item.quantity - 1}
      }
      return item
    })

    updatedCart = updatedCart.filter(item => item.quantity > 0)
    this.setState({cartData: updatedCart})
    localStorage.setItem('cartData', JSON.stringify(updatedCart))
  }

  renderLoadingView = () => (
    <div className="cart-loader-container">
      <Loader type="Oval" color="#F7931E" height="50" width="50" />
    </div>
  )

  renderCartItems = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartData')) || []

    const totalPrize = cartItems.reduce(
      (sum, item) => sum + item.cost * item.quantity,
      0,
    )

    // testid="cartItem" testid="decrement-quantity" testid="increment-quantity" testid="item-quantity" testid="total-price" testid="cartItem"
    return (
      <div className="cart-container">
        {cartItems.length > 0 ? (
          <div className="container-of-items">
            <ul className="cart-ul-subheadings-container">
              <li className="cart-subheading">Item</li>
              <li className="cart-subheading">Quantity</li>
              <li className="cart-subheading">Prize</li>
            </ul>
            <ul className="cart-ul-items-container">
              {cartItems.map(each => (
                <li key={each.id} className="cart-list-item-container">
                  <div className="cart-img-name-container">
                    <img
                      alt="cart-image"
                      src={each.imageUrl}
                      className="cart-item-img"
                    />
                    <h1 className="cart-item-name">{each.name}</h1>
                  </div>
                  <div className="cart-quantity-container">
                    <button
                      type="button"
                      className="add-minus-btn"
                      onClick={() => {
                        this.decreaseQuantity(each.id)
                      }}
                    >
                      -
                    </button>
                    <p className="cart-item-quantity">{each.quantity}</p>
                    <button
                      type="button"
                      className="add-minus-btn"
                      onClick={() => {
                        this.increaseQuantity(each.id)
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-cost-container">
                    <FaRupeeSign color="#ffa412" />
                    <p className="cart-item-cost">
                      {each.cost * each.quantity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <hr className="cart-hr" />
            <div className="cart-btm-container">
              <h1 className="order-total">Order Total:</h1>
              <div>
                <div className="total-prize-container">
                  <FaRupeeSign color="#3e4c59" />
                  <p className="total-prize">{totalPrize}</p>
                </div>
                <button
                  type="button"
                  className="place-order-btn"
                  onClick={this.onClickPlaceOrder}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-orders-container">
            <img
              src="https://res.cloudinary.com/datntizra/image/upload/v1765782268/cooking_1_xxbqrg.png"
              className="no-orders-img"
              alt="empty cart"
            />
            <h1 className="no-orders-heading">No Order Yet!</h1>
            <p className="no-orders-description">
              Your cart is empty. Add something from the menu.
            </p>
            <Link to="/">
              <button type="button" className="order-now-btn">
                Order now
              </button>
            </Link>
          </div>
        )}
      </div>
    )
  }

  render() {
    const {apiStatus, isPlaceOrderClcked} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return (
          <div>
            <Header />
            {isPlaceOrderClcked ? (
              <div className="clicked-place-order-container">
                <img
                  alt="place-order-img"
                  src="https://res.cloudinary.com/datntizra/image/upload/v1765974723/Vector_1_opdckz.png"
                />
                <h1 className="payment-success-heading">Payment Successful</h1>
                <p className="payment-description">
                  Thank you for ordering Your payment is successfully completed.
                </p>
                <Link to="/">
                  <button type="button" className="order-now-btn">
                    Go To Home Page
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                {this.renderCartItems()}
                <Footer />
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }
}

export default Cart
