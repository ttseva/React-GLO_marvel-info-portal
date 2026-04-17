import {useEffect, useState} from "react";
import PropTypes from "prop-types";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";
import useMarvelService from "../../services/MarvelService";
import './charInfo.scss';


const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const {error, loading, getCharacter, clearError} = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId])

  const updateChar = () => {
    const {charId} = props;
    if (!charId) return;
    clearError();
    getCharacter(charId)
      .then(onCharLoaded)
  }

  const onCharLoaded = (char) => {
    setChar(char);
  }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMsg = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
      <div className="char__info">
        {skeleton}
        {errorMsg}
        {spinner}
        {content}
      </div>
    )
}

const View = ({char}) => {
  const {name, description, thumbnail, homepage, wiki, comics} = char;
  const limit = 10;

  const imgStyle = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    ? {'objectFit': 'contain'}
    : {'objectFit': 'cover'};

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt="abyss" style={imgStyle}/>
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__desc">
        {description}
      </div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length ? null : 'No comics found for this character.'}
        {
          comics.slice(0, limit).map((comic, index) => {
            return (
              <li key={index} className="char__comics-item">
                {comic}
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

CharInfo.propTypes = {
  charId: PropTypes.number.isRequired,
}

export default CharInfo;