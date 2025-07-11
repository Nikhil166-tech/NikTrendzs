import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import './index.css'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import {Redirect, Link} from 'react-router-dom'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
    similarProductsData: [],
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,

        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderFailerView = () => (
    <div>
      <img
        alt="errow view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button>Continue Shopping</button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="0b69ff" height="50" width="50" />
    </div>
  )

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderProductDetails = () => {
    const {productData, quantity, similarProductsData} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData
    return (
      <div className="product-details-bg">
        <div className="product-details-ctn">
          <img src={imageUrl} alt={title} className="product-img" />
          <div>
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="rating-c">
              <div className="rating-ctn">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                  className="star"
                />
              </div>
              <p className="review-c">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p>
              <span className="availability">Avalabile:</span> {availability}
            </p>
            <p>
              <span className="availability">Brand:</span> {brand}
            </p>
            <hr />
            <div className="quantity-ctn">
              <button
                className="button"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                className="button"
                onClick={this.onIncrement}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="cart-button"> ADD TO CART</button>
          </div>
        </div>
        <div>
          <h1>Similar Products</h1>
          <ul className="list-items1">
            {similarProductsData.map(eachSimilarProduct => (
              <SimilarProductItem
                productDetails={eachSimilarProduct}
                key={eachSimilarProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView
      case apiStatusConstants.failure:
        return this.renderFailerView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />

        <div className="product-bg">{this.renderProducts()}</div>
      </>
    )
  }
}

export default ProductItemDetails
