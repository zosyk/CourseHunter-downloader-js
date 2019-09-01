import React, {Component} from 'react';
import './url-list.css'

export default class UrlList extends Component {

    render() {
        const elements = this.props.urls.map(item =>
            <li key={item.id} >
                {item.url}
            </li>);

        if (elements.length === 0) {
            return <span>Empty url list</span>
        }

        return (<ul>
            {elements}
        </ul>);
    }
}