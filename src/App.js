import React from 'react';
import './App.css';
import moment from 'moment';

const Story = (props) => {
  const { timestamp, title, url, author } = props;
  return (
    <article>
      <a href={url} target="_blank"><h1 className='title'>{title}</h1></a>
      <p className='posted'>{moment(timestamp).fromNow()} | {author}</p>
    </article>
  )
}

const List = ({list}) => {
  return (
    list.length > 0 ? (
      <div>
        { list.map(result => <Story {...result} />) }
      </div>
    ) : (
      <p>type your query above to search Hacker News...</p>
    )
      
  )
}

class App extends React.Component {
  state = {
    queryText: "",
    sortBy: "Relevance",
    results: [],
    isLoading: false
  }

  getStories = () => {
    let url;

    switch (this.state.sortBy) {
      case 'Date':
        url = `http://hn.algolia.com/api/v1/search_by_date?query=${this.state.queryText}&tags=story`;
        break;
      case 'Relevance':
        url = `http://hn.algolia.com/api/v1/search?query=${this.state.queryText}&tags=story`;
        break;
      default: break;
    }
    if (this.state.queryText.length > 0) {
      this.setState({ isLoading: true });
      fetch(url)
        .then(response => response.json())
        .then(parsedJSON => parsedJSON.hits.map(result => ({
          timestamp: result.created_at,
          title: result.title,
          url: result.url,
          author: result.author
        })))
        .then(posts => this.setState({
          results: posts,
          isLoading: false
        }))
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.getStories();
  }

  onQueryTextChange = (e) => {
    this.setState({
      queryText: e.target.value
    })
  }

  onSelectChange = (e) => {
    this.setState({
      sortBy: e.target.value
    })
    setTimeout(() => { this.getStories() }, 0);
  }

  render() {
    return (
      <div className="App-header">
        <h1>Hacker News Search Engine</h1>
        <form onSubmit={this.onSubmit}>
          <select className="dropdown" value={this.state.sortBy} onChange={this.onSelectChange}>
            <option>Date</option>
            <option>Relevance</option>
          </select>
          <input placeholder="type your query here" onChange={this.onQueryTextChange} />
          <button type="submit">Search</button>
        </form>
        <List list={this.state.results} />
      </div>
    );
  }
}

export default App;
