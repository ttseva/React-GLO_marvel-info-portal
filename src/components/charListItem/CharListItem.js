const CharListItem = (props) => {
  const {name, thumbnail,id} = props.char;

  let noIronManImage = id === 1
    ? 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    : thumbnail

  const imgStyle = noIronManImage === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    ? {'objectFit': 'contain'}
    : {'objectFit': 'cover'};

  return (
    <li className="char__item" onClick={props.onClick}>
      <img src={noIronManImage} alt={thumbnail} style={imgStyle}/>
      <div className="char__name">{name}</div>
    </li>
  )
}

export default CharListItem;