import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Menu, Star, Check } from 'lucide-react'

function App() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [cart, setCart] = useState([])
  
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState('All')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        console.error('API returned non-array data:', data)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) {
      fetchProducts()
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        console.error('API returned non-array data:', data)
        setProducts([])
      }
    } catch (error) {
      console.error('Error recommending products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  const resetToHome = () => {
    setQuery('')
    setSelectedCategory('All')
    setPriceRange('All')
    fetchProducts()
  }

  const safeProducts = Array.isArray(products) ? products : []
  const filteredProducts = safeProducts.filter(product => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false
    if (priceRange === 'Under $25' && product.price >= 25) return false
    if (priceRange === '$25 to $50' && (product.price < 25 || product.price > 50)) return false
    if (priceRange === '$50 to $100' && (product.price < 50 || product.price > 100)) return false
    if (priceRange === 'Over $100' && product.price <= 100) return false
    return true
  })

  const categories = ['All', ...new Set(safeProducts.map(p => p.category))]

  console.log('Rendering App. Products:', safeProducts.length, 'Filtered:', filteredProducts.length)

  return (
    <div className="app-container">
      <header className="amazon-header">
        <div className="header-left">
          <div className="logo" onClick={resetToHome}>
            <span className="brand">amazon</span>
            <span className="domain">.ai</span>
          </div>
          <div className="location-picker">
            <div className="loc-icon">📍</div>
            <div className="loc-text">
              <span className="deliver-to">Deliver to</span>
              <span className="city">New York</span>
            </div>
          </div>
        </div>

        <div className="header-search">
          <form onSubmit={handleSearch}>
            <div className="search-dropdown" onClick={resetToHome}>
              <span>All</span>
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Amazon.ai"
            />
            <button type="submit" className="search-btn">
              <Search size={20} />
            </button>
          </form>
        </div>

        <div className="header-right">
          <div className="nav-item">
            <span className="nav-line-1">Hello, sign in</span>
            <span className="nav-line-2">Account & Lists</span>
          </div>
          <div className="nav-item">
            <span className="nav-line-1">Returns</span>
            <span className="nav-line-2">& Orders</span>
          </div>
          <div className="nav-cart">
            <div className="cart-icon-wrapper">
              <ShoppingCart size={30} />
              <span className="cart-count">{cart.length}</span>
            </div>
            <span className="cart-label">Cart</span>
          </div>
        </div>
      </header>

      <div className="sub-header">
        <div className="menu-trigger" onClick={resetToHome}>
          <Menu size={20} />
          <span>All</span>
        </div>
        <span>Today's Deals</span>
        <span>Customer Service</span>
        <span>Registry</span>
        <span>Gift Cards</span>
        <span>Sell</span>
      </div>

      <main className="main-content">
        <aside className="sidebar">
          <div className="filter-section">
            <h3>Department</h3>
            <ul>
              {categories.map(cat => (
                <li 
                  key={cat} 
                  className={selectedCategory === cat ? 'active' : ''}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3>Price</h3>
            <ul>
              {['All', 'Under $25', '$25 to $50', '$50 to $100', 'Over $100'].map(range => (
                <li 
                  key={range}
                  className={priceRange === range ? 'active' : ''}
                  onClick={() => setPriceRange(range)}
                >
                  {range}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3>Avg. Customer Review</h3>
            <div className="stars-filter">
              {[4, 3, 2, 1].map(stars => (
                <div key={stars} className="star-row">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < stars ? "#ffa41c" : "none"} stroke={i < stars ? "#ffa41c" : "#DE7921"} />
                    ))}
                  </div>
                  <span>& Up</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="results-section">
          {initialLoading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <>
              <div className="results-header">
                <h2>Results</h2>
                <span>Check each product page for other buying options.</span>
              </div>
              
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="amazon-card">
                    <div className="card-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="card-details">
                      <h3 className="product-title">{product.name}</h3>
                      
                      <div className="rating-row">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              fill={i < Math.floor(product.rating) ? "#ffa41c" : "none"} 
                              stroke={i < Math.floor(product.rating) ? "#ffa41c" : "#DE7921"}
                              className="star-icon"
                            />
                          ))}
                        </div>
                        <span className="rating-count">{product.reviews}</span>
                      </div>

                      <div className="price-row">
                        <span className="currency">$</span>
                        <span className="price-whole">{Math.floor(product.price)}</span>
                        <span className="price-fraction">{(product.price % 1).toFixed(2).substring(2)}</span>
                      </div>

                      {product.is_prime && (
                        <div className="prime-badge">
                          <span className="check"><Check size={12} strokeWidth={4} /></span>
                          <span className="prime-text">prime</span>
                        </div>
                      )}

                      <div className="delivery-info">
                        <span>FREE delivery </span>
                        <span className="date">Mon, Nov 27</span>
                      </div>

                      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
