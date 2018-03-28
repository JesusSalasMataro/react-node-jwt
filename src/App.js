import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import './App.css'

const cookies = new Cookies()

class App extends Component {

    state = {
        urlApi: 'http://localhost:8080/',
        token: '',
        username: '',
        password: ''
    }

    createJwt = () => {
        const { urlApi, username, password } = this.state
        const url = urlApi + '?username=' + username + '&password=' + password
        fetch(url, { credentials: 'include' })
            .then(response => {
                this.setState(
                    {
                        token: response.headers.get('X-Token')
                    }
                )

                if (this.state.token === '') {
                    this.deleteCookie()
                }
                else {
                    this.saveCookie(this.state.token)
                }
            })
    }

    deleteJwt = () => {
        this.deleteCookie()
        this.setState({
            token: ''
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

    saveCookie = (token) => {
        cookies.set('jwt', token)
    }

    deleteCookie = () => {
        cookies.remove('jwt')
    }

    render() {
        return (
            <div className="App">
                <h3>JWT example</h3>
                <br />
                <p>
                    Valid credentials > user:Jesus pwd:12345
                </p>
                <br />
                <input type="text" placeholder="Username..." name="username" onBlur={this.updateUsername} />
                <input type="text" placeholder="Password..." name="password" onBlur={this.updatePassword} />
                <br />
                <br />
                <input type="button" name="createJwt" value="Create JWT" onClick={this.createJwt} />
                <input type="button" name="reloadJwt" value="Reload JWT" />
                <input type="button" name="deleteJwt" value="Delete JWT" onClick={this.deleteJwt} />
                <br />
                <br />
                <div>
                    <span>
                    {
                        this.state.token === '' 
                            ?   'No token'
                            :   <div>
                                    <span>Token:</span>
                                    <br/>
                                    <span>{this.state.token}</span>
                                </div>
                    }
                    </span>
                </div>
            </div>
        );
    }
}

export default App;
