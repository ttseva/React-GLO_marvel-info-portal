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
    // newItemLoading: false,
    offset: 0,
    limit: +localStorage.getItem('limit') || 9,
    // outOfChars: false,
  }

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  onRequest = (offset, limit) => {
    this.onCharListLoading()



    this.marvelService
      // .getAllCharacters(offset, limit)
      .getAllCharacters(0, limit)
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
    // let ended = false;
    // if (newChars.length <= 9) ended = true;

    // localstorage.setItem('limit', this.state.limit)
    this.setState(({offset, chars, limit}) => ({
      chars: [...newChars],
      loading: false,
      limit: limit,

      // newItemLoading: false,
      // chars: [...chars, ...newChars.slice(0, 9)],
      // offset: offset + 9,
      // outOfChars: ended,
    }))
  };

  render() {
    const {chars, loading, error} = this.state;

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
        {/*<button*/}
        {/*  className="button button__main button__long"*/}
        {/*  disabled={newItemLoading}*/}
        {/*  style={{'display': outOfChars ? 'none' : 'block'}}*/}
        {/*  onClick={() => this.onRequest(offset)}>*/}
        {/*  <div className="inner">load more</div>*/}
        {/*</button>*/}
      </div>
    )
  }
}

export default CharList;