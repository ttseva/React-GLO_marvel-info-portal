import {Component} from "react";

import './randomChar.scss';
import MarvelService from "../../services/MarvelService";

class RandomChar extends Component {
  state = {
    char: {},
  }
  marvelService = new MarvelService();

  constructor(props) {
    super(props);
    this.updateChar();
  }

  onCharLoader = (char) => {
    this.setState({char});
  }

  updateChar = () => {
    const id = Math.floor(Math.random() * 19) + 1;
    this.marvelService
      .getCharacter(id)
      .then(this.onCharLoader)
  }

  editDescription = (description) => {
    if (!description) return "No description yet...";

    return (description.trim().length > 140)
      ? description.slice(0, 140) + '...'
      : description
  }

  render() {
    const {char: {name, description, homepage, thumbnail, wiki}} = this.state;

    let desc = this.editDescription(description);

    return (
      <div className="randomchar">
        <div className="randomchar__block">
          <img src={
            thumbnail
          } alt="Random character" className="randomchar__img"/>
          <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
              {desc}
            </p>
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
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!<br/>
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">
            Or choose another one
          </p>
          <button className="button button__main">
            <div className="inner">try it</div>
          </button>
          <img src="" alt="mjolnir" className="randomchar__decoration"/>
        </div>
      </div>
    )
  }
}

export default RandomChar;