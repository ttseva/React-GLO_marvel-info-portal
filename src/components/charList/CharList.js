import {useEffect, useState} from "react";
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import PropTypes from "prop-types";

import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import CharListItem from "../charListItem/CharListItem";

import './charList.scss';

const CHARS_PER_PAGE = 9;

const CharList = (props) => {
  const [chars, setChars] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [outOfChars, setOutOfChars] = useState(false);

  const {loading, error, getAllCharacters} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset, CHARS_PER_PAGE + 1)
      .then(onCharListLoaded)
  }

  const onCharListLoaded = (newChars) => {
    let ended = false;
    if (newChars.length <= CHARS_PER_PAGE) ended = true;

    setChars(() => [...chars, ...newChars.slice(0, CHARS_PER_PAGE)]);
    setNewItemLoading(false);
    setOffset(offset => offset + CHARS_PER_PAGE);
    setOutOfChars(ended);
  };

  const listChars = <TransitionGroup component={null}>
    {chars.map((char) => (
      <CSSTransition key={char.id} timeout={700} classNames="char__item" mountOnEnter>
        <CharListItem char={char}
                      onChoose={() => props.onCharSelected(char.id)}
                      isSelected={props.selectedChar === char.id}/>
      </CSSTransition>
    ))}
  </TransitionGroup>;

  const errorMsg = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner/> : null;

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