import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, brand, imageUrl, rating, price} = productDetails
  return (
    <li className="list-items">
      <img
        src={imageUrl}
        className="similar-img"
        alt={`similar product ${title}`}
      />
      <p className="title1"> {title}</p>
      <p className="brand1">
        <span>by</span> {brand}
      </p>
      <div>
        <p className="price1">Rs {price}/-</p>
        <div className="rating-ctn1">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-img"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
