import React, {Component} from 'react';
import './App.css'
import UrlList from '../url-list'

export default class App extends Component {

    state = {
        urls: [],

        email: '',
        password: '',
        course_url: '',
        out: '',
    };

    handleChangeEmail = (event) => {
        this.setState({email: event.target.value});
    };

    handleChangePassword = (event) => {
        this.setState({password: event.target.value});
    };

    handleChangeUrl = (event) => {
        this.setState({course_url: event.target.value});
    };

    handleChangeOut = (event) => {
        this.setState({out: event.target.value});
    };

    onClick = () => {
        const {email, password, course_url, out} = this.state;

        fetch(`http://localhost:3001/api/urls?email=${email}&password=${password}&url=${course_url}&out=${out}`)
            .then(data => data.json())
            .then(res => this.setState({urls: res.urls}));
    };

    render() {
        return (
            <div>
                <h1>Course Hunter downloader</h1>
                <div>
                    <label htmlFor="email">User email</label>
                    <input type="text" id="email" name="email"
                           onChange={this.handleChangeEmail}
                           value={this.state.email}/>
                </div>
                <div>
                    <label htmlFor="password">User password</label>
                    <input type="password" id="password" name="password"
                           onChange={this.handleChangePassword}
                           value={this.state.password}/>
                </div>
                <div>
                    <label htmlFor="url">Course url, which you want to download</label>
                    <input type="text" id="url" name="url"
                           onChange={this.handleChangeUrl}
                           value={this.state.course_url}/>
                </div>
                <div>
                    <label htmlFor="out">Output directory</label>
                    <input type="text" id="out" name="out"
                           onChange={this.handleChangeOut}
                           value={this.state.out}/>
                </div>
                <div>
                    <button id="download"
                            onClick={this.onClick}>
                        Download All
                    </button>
                </div>


                <UrlList urls={this.state.urls}/>
            </div>
        );
    }
}