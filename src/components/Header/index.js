import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'
import {Link, NavLink, withRouter} from 'react-router-dom'

class Header extends Component {
  onClickLogout = () => {
    console.log('logout')
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    return (
      <div className="header-container">
        <div className="left-header">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/datntizra/image/upload/v1765190256/Frame_274_r0rjrq.png"
              className="header-logo"
              alt="website logo"
            />
          </Link>
          <h1 className="header-heading">Tasty Kitchens</h1>
        </div>
        <ul className="right-header">
          <li>
            <NavLink
              exact
              to="/"
              className="non-active link"
              activeClassName="active"
            >
              <button type="button" className="link-buttons">
                Home
              </button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cart"
              className="non-active link"
              activeClassName="active"
            >
              <button type="button" className="link-buttons">
                Cart
              </button>
            </NavLink>
          </li>
          <li>
            <button
              type="button"
              className="logout-button"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    )
  }
}

export default withRouter(Header)
