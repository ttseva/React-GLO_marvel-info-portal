const CharListItem = (props) => {
  const {name, thumbnail} = props.char;

  const imgStyle = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    ? {'objectFit': 'contain'}
    : {'objectFit': 'cover'}
  ;
  const classSelected = props.isSelected
    ? "char__item char__item_selected"
    : "char__item";

  return (
    <li className={classSelected}
        onClick={props.onChoose}
        onFocus={props.onChoose}
        tabIndex={0}>
      <img src={thumbnail} alt={thumbnail} style={imgStyle}/>
      <div className="char__name">{name}</div>
    </li>
  )
}

export default CharListItem;