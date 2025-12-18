import {Component} from 'react'

import './index.css'

class Counter extends Component {
  onDecrement = () => {
    const {product, decreaseQuantity, quantity} = this.props
    if (quantity > 0) {
      decreaseQuantity(product.id)
    }
  }

  onIncrement = () => {
    const {product, increaseQuantity} = this.props
    increaseQuantity(product.id)
  }

  render() {
    const {quantity} = this.props

    if (quantity === 0) {
      return null
    }

    // testid="decrement-count" 35 testid="active-count" 38 testid="increment-count"
    return (
      <div className="quantity-buttons-container">
        <button
          type="button"
          className="add-minus-btn"
          onClick={this.onDecrement}
        >
          -
        </button>
        {quantity > 0 && <p>{quantity}</p>}

        <button
          type="button"
          className="add-minus-btn"
          onClick={this.onIncrement}
        >
          +
        </button>
      </div>
    )
  }
}

export default Counter
