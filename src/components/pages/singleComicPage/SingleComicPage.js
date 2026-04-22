import {NavLink, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

import Spinner from "../../spinner/Spinner";
import ErrorMessage from "../../errorMessage/ErrorMessage";
import useMarvelService from "../../../services/MarvelService";

import './singleComicPage.scss';

const SingleComicPage = () => {
  const {comicId} = useParams();
  const [comic, setComic] = useState(null);

  const {error, loading, getComic, clearError} = useMarvelService();


  useEffect(() => {
    updateComic();
  }, [comicId])

  const updateComic = () => {
    clearError();
    getComic(comicId)
      .then(onComicLoaded)
  }

  const onComicLoaded = (comic) => {
    setComic(comic);
  }


  const errorMsg = error ? <ErrorMessage/> : null;
  const spinner = loading ? <Spinner/> : null;
  const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

  return (
    <>
      {errorMsg}
      {spinner}
      {content}
    </>
  )
}

const View = ({comic}) => {
  const {title, description, pageCount, thumbnail, languages, price} = comic
  return (
    <div className="single-comic">
      <img src={thumbnail} alt={title} className="single-comic__img"/>
      <div className="single-comic__info">
        <h2 className="single-comic__name">{title}</h2>
        <p className="single-comic__desc">{description}</p>
        <p className="single-comic__desc">{pageCount} p.</p>
        <p className="single-comic__desc">Language: {languages}</p>
        <div className="single-comic__price">{price}$</div>
      </div>
      <NavLink to='/' className="single-comic__back">Back to all</NavLink>
    </div>
  )
}

export default SingleComicPage;