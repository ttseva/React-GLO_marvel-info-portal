import {useEffect, useState} from "react";

import useMarvelService from "../../services/MarvelService";
import {ComicsListItem} from "../comicsListItem/ComicsListItem";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

import './comicsList.scss';

const COMICS_PER_PAGE = 8;

const ComicsList = () => {

  const {loading, error, getAllComics} = useMarvelService()
  const [offset, setOffset] = useState(0);
  const [comics, setComics] = useState([]);
  const [isEnded, setIsEnded] = useState(false);


  const onRequest = () => {
    getAllComics(offset, 9)
      .then(onNewComics)
  }

  const onNewComics = (newComics) => {
    if (newComics.length <= COMICS_PER_PAGE) setIsEnded(true);

    setComics(comics => [...comics, ...newComics.slice(0, COMICS_PER_PAGE)]);
    setOffset(offset => offset + COMICS_PER_PAGE);

    return getNewList();
  }

  const getNewList = () => {
    const newList = comics.map((comic, index) => (
      <ComicsListItem comic={comic} key={index}/>
    ))
    return <ul className="comics__grid">{newList}</ul>
  };

  useEffect(() => {
    onRequest()
  }, [])


  const errorMsg = error ? <ErrorMessage/> : null;
  const spinner = loading && comics.length === 0 ? <Spinner/> : null;

  return (
    <div className="comics__list">
      {errorMsg}
      {spinner}
      {getNewList()}
      <button className="button button__main button__long"
              onClick={() => onRequest()}
              style={{visibility: isEnded ? 'hidden' : 'block'}}
              disabled={loading}>
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

export default ComicsList;