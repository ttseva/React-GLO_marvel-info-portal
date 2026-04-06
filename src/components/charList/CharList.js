import './charList.scss';
import {Component} from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import CharListItem from "../charListItem/CharListItem";

class CharList extends Component {
  state = {
    chars: [],
    char: {},
    loading: true,
    error: false
  }

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChars();
  }

  updateChars = () => {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharsLoader)
      .catch(this.onError);
  }

  onError = () => {
    this.setState({loading: false, error: true});
  }

  onCharsLoader = (chars) => {
    this.setState({chars: chars, loading: false,});
  };

  render() {
    const {chars, loading, error} = this.state;
    const limit = 9;

    const listChars = chars.slice(0, limit).map((char) => (
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
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

export default CharList;