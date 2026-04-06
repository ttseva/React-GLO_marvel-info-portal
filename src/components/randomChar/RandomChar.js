import {Component} from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png'

class RandomChar extends Component {
  state = {
    char: {},
    loading: true,
    error: false,
  }

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
    // this.timerId = setInterval(this.updateChar, 3000)
  }

  componentWillUnmount() {
    // clearInterval(this.timerId);
  }

  updateChar = () => {
    const id = Math.floor(Math.random() * 18) + 2;
    this.marvelService
      .getCharacter(id)
      .then(this.onCharLoader)
      .catch(this.onError);
  }

  onError = () => {
    this.setState({loading: false, error: true});
  }

  onCharLoader = (char) => {
    let img = new Image();

    img.onload = () => {
      this.setState({char, loading: false});
    };
    img.src = char.thumbnail;
  }

  render() {
    const {char, loading, error} = this.state;

    const errorMsg = error ? <ErrorMessage/> : null;
    const spinner = (loading) ? <Spinner/> : null;
    const content = !(loading || error) ? <View char={char}/> : null;

    return (
      <div className="randomchar">
        {errorMsg}
        {spinner}
        {content}
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!<br/>
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">
            Or choose another one
          </p>
          <button className="button button__main" onClick={() => {
            this.setState({loading: true});
            this.updateChar()
          }}>
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
        </div>
      </div>
    )
  }
}

const View = ({char}) => {
  const {name, description, homepage, thumbnail, wiki} = char;

  const imgStyle = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    ? {'objectFit': 'contain'}
    : {'objectFit': 'cover'};

  const editDescription = (description) => {
    if (!description) return "No description yet...";

    return (description.trim().length > 140)
      ? description.slice(0, 140) + '...'
      : description
  }

  const desc = editDescription(description);


  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" style={imgStyle} className="randomchar__img"/>
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__desc">{desc}</p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default RandomChar;