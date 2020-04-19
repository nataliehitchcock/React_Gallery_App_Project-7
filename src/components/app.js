//Creating a stateful class component
import React, { Component } from 'react';
import '../css/index.css';
import axios from 'axios';
import apiInfo from '../config';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

//Importing components
import SearchBar from './SearchBar';
import CategoriesNav from './CategoriesNav';
import Gallery from './Gallery';
import NotFound from './NotFound';

export default class App extends Component {
  
  constructor(props) {

    super(props);
    //Setting state to make a place for the Flickr data to go
    this.state = {
      photos: [],
      queryContent: '',
      loading: true
    }
  }

  //This method is to search the Flickr API from the search form in SearchBar.js
  //Creates it as an arrow function to auto bind this keyword.
  search = (query) => {

    const apiSearchCall = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiInfo.key}&tags=${query}&per_page=24&format=json&nojsoncallback=1`;

    //api call
    axios.get(apiSearchCall)
      .then(response => {
        this.setState({
          photos: response.data.photos.photo,
          queryContent: query,
          loading: false
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data: ', error);
      });

    this.setState({loading: true});
  }

  render() {
    return (
      <HashRouter>
        <div className="container">
          <SearchBar onSearch={this.search} loading={this.state.loading} />
          <CategoriesNav fetchData={this.search} />
          <Switch>
            <Route exact path="/" render={ () => <Redirect to="/dogs" />} />
            <Route exact path="/search/:searchtext" render={ (props) => <Gallery {...props} data={this.state.photos} query={this.state.queryContent} loading={this.state.loading} fetchData={this.search} />} />
            <Route path="/(dogs|cats|chinchillas)" render={ (props) => <Gallery {...props} data={this.state.photos} query={this.state.queryContent} loading={this.state.loading} fetchData={this.search} />} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}