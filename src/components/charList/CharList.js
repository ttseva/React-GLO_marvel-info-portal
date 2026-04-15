import {useEffect, useState} from "react";
import PropTypes from "prop-types";

import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import CharListItem from "../charListItem/CharListItem";

import './charList.scss';
import useMarvelService from "../../services/MarvelService";


const CharList = (props) => {

  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [outOfChars, setOutOfChars] = useState(false);

  const marvelService = useMarvelService();

  useEffect(() => {
    onRequest();
  }, [])

  const onRequest = (offset) => {
    onCharListLoading()

    marvelService
      .getAllCharacters(offset, 10)
      .then(onCharListLoaded)
      .catch(onError);
  }

  const onCharListLoaded = (newChars) => {
    let ended = false;
    if (newChars.length <= 9) ended = true;

    setChars(() => [...chars, ...newChars.slice(0, 9)]);
    setLoading(false);
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setOutOfChars(ended);
  };

  const onCharListLoading = () => {
    setNewItemLoading(true);
  }

  const onError = () => {
    setError(true);
    setLoading(false);
  }

  const listChars = chars.map((char) => (
    <CharListItem
      char={char}
      key={char.id}
      onChoose={() => props.onCharSelected(char.id)}
      isSelected={props.selectedChar === char.id}/>
  ));

  const errorMsg = error ? <ErrorMessage/> : null;
  const spinner = (loading) ? <Spinner/> : null;
  const content = !(loading || error) ? <ul className="char__grid">{listChars}</ul> : null;

  return (
    <div className="char__list">
      {errorMsg}
      {spinner}
      {content}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{'display': outOfChars ? 'none' : 'block'}}
        onClick={() => onRequest(offset)}>
        <div className="inner">load more</div>
      </button>
    </div>
  )
}


CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
}


export default CharList;