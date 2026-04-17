export const ComicsListItem = props => {
  const comic = props.comic;

  return (
    <li className="comics__item">
      <a href="#">
        <img src={comic.thumbnail} alt="ultimate war" className="comics__item-img"/>
        <div className="comics__item-name">{comic.title}</div>
        <div className="comics__item-price">{comic.price}</div>
      </a>
    </li>
  )
}