import {useEffect, useState} from "react";
import PropTypes from "prop-types";

import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import CharListItem from "../charListItem/CharListItem";

import './charList.scss';


const CharList = (props) => {
  const [chars, setChars] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [outOfChars, setOutOfChars] = useState(false);

  const {loading, error, getAllCharacters} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset, 10)
      .then(onCharListLoaded)
  }

  const onCharListLoaded = (newChars) => {
    let ended = false;
    if (newChars.length <= 9) ended = true;

    setChars(() => [...chars, ...newChars.slice(0, 9)]);
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setOutOfChars(ended);
  };

  const listChars = chars.map((char) => (
    <CharListItem
      char={char}
      key={char.id}
      onChoose={() => props.onCharSelected(char.id)}
      isSelected={props.selectedChar === char.id}/>
  ));

  const errorMsg = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner/> : null;
  // const content = !(loading || error) ? <ul className="char__grid">{listChars}</ul> : null;

  return (
    <div className="char__list">
      {errorMsg}
      {spinner}
      <ul className="char__grid">{listChars}</ul>
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