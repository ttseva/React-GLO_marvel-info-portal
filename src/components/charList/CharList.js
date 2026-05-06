import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";
import CharListItem from "../charListItem/CharListItem";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './charList.scss';

const CHARS_PER_PAGE = 9;

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

const CharList = (props) => {
  const [chars, setChars] = useState([]);
  const [offset, setOffset] = useState(0);
  const [outOfChars, setOutOfChars] = useState(false);

  const { getAllCharacters, process, setProcess } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, [])

  const onRequest = (offset) => {
    getAllCharacters(offset, CHARS_PER_PAGE + 1)
      .then(onCharListLoaded)
      .then(() => setProcess('confirmed'))
  }

  const onCharListLoaded = (newChars) => {
    let ended = false;
    if (newChars.length <= CHARS_PER_PAGE) ended = true;

    setChars(() => [...chars, ...newChars.slice(0, CHARS_PER_PAGE)]);
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

  const listGen = (listChars) => {
    return <ul className="char__grid">{listChars}</ul>
  }

  return (
    <div className="char__list">
      {setContent(process, () => listGen(listChars), chars.length === 0)}
      <button
        className="button button__main button__long"
        disabled={process === 'loading'}
        style={{ 'display': outOfChars ? 'none' : 'block' }}
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