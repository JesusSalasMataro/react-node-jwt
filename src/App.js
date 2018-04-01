import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import './App.css'

const cookies = new Cookies()

class App extends Component {

    state = {
        urlApi: 'http://localhost:8080/',
        token: '',
        username: '',
        password: '',
        message: ''
    }

    componentWillMount = () => {
        this.deleteCookie();
    }

    deleteJwt = () => {
        this.deleteCookie()
        this.setState({
            token: '',
            message: 'Token deleted'
        })
    }

    updateUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    updatePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    updateToken = (event) => {
        this.setState({
            token: event.target.value
        })

        this.saveCookie(event.target.value)
    }

    saveCookie = (token) => {
        cookies.set('jwt', token)
    }

    deleteCookie = () => {
        cookies.remove('jwt')
    }

    apiCall = () => {
        const { urlApi, username, password } = this.state
        const url = urlApi + '?username=' + username + '&password=' + password
        let message = ''
        let tokenFromResponse = ''

        fetch(url, { credentials: 'include' })
            .then(response => {
                tokenFromResponse = response.headers.get('X-Token')
                
                if (tokenFromResponse === '') {
                    if (this.state.token === '') {
                        message = 'Token not created, check credentials'
                    }
                    else {
                        message = 'Token changed, not valid token'
                    }
                }
                else {
                    message = 'Token created'
                }

                this.setState(
                    {
                        token: tokenFromResponse,
                        message: message
                    }
                )

                if (tokenFromResponse === '') {
                    this.deleteCookie()
                }
                else {
                    this.saveCookie(tokenFromResponse)
                }
            })
            .catch((error) => {
                this.setState({
                    token: '',
                    message: 'Server error, check if server is on'
                })
            })
    }

    render() {
        const disabledBtnCreateJwt = 
            this.state.token === '' 
                ? false 
                : true
        
        const disabledBtnReloadJwt = 
            this.state.token === '' 
                ? true 
                : false

        return (
            <div className="App">
                <h3>JWT example</h3>
                <br />
                <p>
                    <b>Valid credentials</b>
                    <ul>
                        <li>Username: Jesus</li>                    
                        <li>Password: 12345</li>
                    </ul>
                </p>
                <br />
                <input type="text" placeholder="Username..." name="username" onBlur={this.updateUsername} />
                <input type="text" placeholder="Password..." name="password" onBlur={this.updatePassword} />
                <br />
                <br />
                <input type="button" name="createJwt" value="Create JWT" onClick={this.apiCall} disabled={disabledBtnCreateJwt} />
                <input type="button" name="reloadJwt" value="Reload JWT" onClick={this.apiCall} disabled={disabledBtnReloadJwt} />
                <input type="button" name="deleteJwt" value="Delete JWT" onClick={this.deleteJwt} />
                <br />
                <br />
                <div>
                    <span>
                    {
                        this.state.message === ''
                            ?   ''
                            :   <div id="txtMessage">
                                    <span>{this.state.message}</span>                                    
                                </div>
                    }
                    {
                        this.state.token === '' 
                            ?   'No token'
                            :   <div>
                                    <span>Token:</span>
                                    <br/>
                                    <input type="text" id="txtToken" value={this.state.token} onChange={this.updateToken} />
                                </div>
                    }
                    </span>
                </div>
            </div>
        );
    }
}

export default App;
