import React, { Component } from 'react'
import './App.css'

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
        fetch(url)
            .then(response => this.setState(
                                    {
                                        token: response.headers.get('X-Token')
                                    }))
    }

    deleteJwt = () => {

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

    render() {
        return (
            <div className="App">
                <h3>JWT example</h3>
                <br />
                <p>
                    Valid credentials > user:abc pwd:123
                </p>
                <br />
                <input type="text" placeholder="Username..." name="username" onBlur={this.updateUsername} />
                <input type="text" placeholder="Password..." name="password" onBlur={this.updatePassword} />
                <br />
                <br />
                <input type="button" name="createJwt" value="Create JWT" onClick={this.createJwt} />
                <input type="button" name="reloadJwt" value="Reload JWT" />
                <input type="button" name="deleteJwt" value="Delete JWT" />
                <br />
                <p>
                    <span>
                    {
                        this.state.token === '' 
                            ? 'No token'
                            : this.state.token
                    }
                    </span>
                </p>
            </div>
        );
    }
}

export default App;
