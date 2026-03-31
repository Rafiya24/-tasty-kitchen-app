import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMsg: ''}

  onChangeInput = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = msg => {
    this.setState({showError: true, errorMsg: msg})
  }

  onSubmitLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {
      username,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showError, errorMsg} = this.state

    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg-container">
        <div className="left-container">
          <form className="login-container" onSubmit={this.onSubmitLogin}>
            <img
              src="https://res.cloudinary.com/datntizra/image/upload/v1765190256/Frame_274_r0rjrq.png"
              className="hat-logo"
              alt="website logo"
            />
            <h1 className="logo-heading">Tasty Kitchens</h1>
            <h1 className="login-heading">Login</h1>
            <div className="input-label-container">
              <label htmlFor="name" className="credentials">
                USERNAME
              </label>
              <input
                value={username}
                id="name"
                type="text"
                className="input"
                onChange={this.onChangeInput}
              />
            </div>
            <div className="input-label-container">
              <label htmlFor="password" className="credentials">
                PASSWORD
              </label>
              <input
                value={password}
                id="password"
                type="password"
                className="input"
                onChange={this.onChangePassword}
              />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
            {showError && <p className="login-error">{errorMsg}</p>}
          </form>
          <div className="demo-credentials-container">
            <h1 className="demo-credentials-heading">Demo Credentials</h1>
            <p className="credentials">Username: rahul</p>
            <p className="credentials">Password: rahul@2021</p>
          </div>
        </div>
        <div>
          <img
            src="https://res.cloudinary.com/datntizra/image/upload/v1765189296/Rectangle_1456_1_ymjjwt.png"
            className="login-image"
            alt="website login"
          />
        </div>
      </div>
    )
  }
}

export default Login
