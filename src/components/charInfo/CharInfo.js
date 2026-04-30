import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";
import useMarvelService from "../../services/MarvelService";

import './charInfo.scss';

const COMICS_AMOUNT = 21

const CharInfo = (props) => {
  const [char, setChar] = useState(null);
  const [allComics, setAllComics] = useState([]);

  const { error, loading, getCharacter, getAllComics, clearError } = useMarvelService();

  useEffect(() => {
    updateComics()
    updateChar();
  }, [props.charId])

  const updateChar = () => {
    const { charId } = props;
    if (!charId) return;
    clearError();
    getCharacter(charId)
      .then(onCharLoaded)
  }

  const updateComics = () => {
    getAllComics(undefined, COMICS_AMOUNT).then((comics) => {
      setAllComics(comics);
    })
  }

  const getComicsLinks = (charComics, allComics) => {
    return charComics.map(charComic => {
      const match = allComics.find(comic => comic.title === charComic);
      return match ? { id: match.id, title: match.title } : { id: null, title: charComic };
    });
  }

  const onCharLoaded = (char) => {
    const comics = getComicsLinks(char.comics, allComics);
    const updatedChar = {
      ...char,
      comics: comics,
    }

    setChar(updatedChar);
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

const View = ({ char }) => {
  const { name, description, thumbnail, comics, homepage, wiki } = char;

  const imgStyle = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    ? { 'objectFit': 'contain' }
    : { 'objectFit': 'cover' };

  const comicsList = comics.map((comic) => {
    return comic.id ?
      <NavLink key={comic.id} className="char__comics-item" to={`/comics/${comic.id}`}>
        {comic.title}
      </NavLink> :
      <li key={comic.id} className="char__comics-item">
        {comic.title}
      </li>
  })

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
        {comicsList.length === 0 && 'No comics found for this character.'}
        {comicsList}
      </ul>
    </>
  )
}

// CharInfo.propTypes = {
//   charId: PropTypes.number.isRequired,
// }

export default CharInfo;