import { useEffect, useState } from "react";

import useMarvelService from "../../services/MarvelService";
import { ComicsListItem } from "../comicsListItem/ComicsListItem";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

import './comicsList.scss';

const COMICS_PER_PAGE = 8;

const setContent = (process, Component, wasLoaded) => {
  switch (process) {
    case 'waiting':
      return <Spinner/>
    case 'loading':
      return wasLoaded ? <Spinner/> : <Component/>
    case 'confirmed':
      return <Component/>
    case 'error':
      return <ErrorMessage/>
    default:
      throw new Error(`Unexpected process state`);
  }
}

const ComicsList = () => {

  const { getAllComics, process, setProcess } = useMarvelService()
  const [offset, setOffset] = useState(0);
  const [comics, setComics] = useState([]);
  const [isEnded, setIsEnded] = useState(false);


  const onRequest = () => {
    getAllComics(offset, 9)
      .then(onNewComics)
      .then(() => setProcess('confirmed'))
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

  return (
    <div className="comics__list">
      {setContent(process, () => getNewList(), comics.length === 0)}
      <button className="button button__main button__long"
              onClick={() => onRequest()}
              style={{ visibility: isEnded ? 'hidden' : 'block' }}
              disabled={process === 'loading'}>
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

export default ComicsList;