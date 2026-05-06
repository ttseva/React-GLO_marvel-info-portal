import { useEffect, useState } from "react";

import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png'

const MAX_CHAR_ID = 20;

const RandomChar = props => {
  const [char, setChar] = useState({});
  const { getCharacter, clearError, process, setProcess } = useMarvelService();

  useEffect(() => {
    updateChar();

    const intervalId = setInterval(updateChar, 60000);
    return () => {
      clearInterval(intervalId);
    }
  }, [])

  const updateChar = () => {
    clearError();

    const id = Math.floor(Math.random() * MAX_CHAR_ID) + 2;
    getCharacter(id)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed'))
  }

  const onCharLoaded = (char) => {
    setChar(char)
  }

  return (
    <div className="randomchar">
      {setContent(process, View, char)}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!<br/>
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">
          Or choose another one
        </p>
        <button className="button button__main"
                disabled={process === 'loading'}
                onClick={() => {
                  updateChar()
                }}>
          <div className="inner">try it</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
      </div>
    </div>
  )
}

const View = ({ data }) => {
  const { name, description, homepage, thumbnail, wiki } = data;

  const imgStyle = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    ? { 'objectFit': 'contain' }
    : { 'objectFit': 'cover' };

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