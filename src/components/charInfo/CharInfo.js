import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";

import './charInfo.scss';

const COMICS_AMOUNT = 21

const CharInfo = (props) => {
  const [char, setChar] = useState(null);
  const [allComics, setAllComics] = useState([]);

  const { getCharacter, getAllComics, clearError, process, setProcess } = useMarvelService();

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
      .then(() => setProcess('confirmed'))
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

  return (
    <div className="char__info">
      {setContent(process, View,char)}
    </div>
  )
}

const View = ({ data }) => {
  const { name, description, thumbnail, comics, homepage, wiki } = data;

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