import './charList.scss';
import {Component} from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import CharListItem from "../charListItem/CharListItem";

class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 0,
    outOfChars: false,
  }

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  onRequest = (offset) => {
    this.onCharListLoading()

    this.marvelService
      .getAllCharacters(offset, 10)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  }

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    })
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true
    });
  }

  onCharListLoaded = (newChars) => {
    let ended = false;
    if (newChars.length <= 9) ended = true;

    this.setState(({offset, chars}) => ({
      chars: [...chars, ...newChars.slice(0, 9)],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      outOfChars: ended
    }))
  };

  render() {
    const {chars, loading, error, newItemLoading, offset, outOfChars} = this.state;

    const listChars = chars.map((char) => (
      <CharListItem char={char} key={char.id} onClick={() => this.props.onCharSelected(char.id)}/>
    ));

    const errorMsg = error ? <ErrorMessage/> : null;
    const spinner = (loading) ? <Spinner/> : null;
    const content = !(loading || error) ? <ul className="char__grid">{listChars}</ul> : null;

    return (
      <div className="char__list">
        {errorMsg}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{'display': outOfChars ? 'none' : 'block'}}
          onClick={() => this.onRequest(offset)}>
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

export default CharList;