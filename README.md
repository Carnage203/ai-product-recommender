# AI Product Recommendation System

An intelligent e-commerce product recommendation system powered by Google Gemini AI. Built with React and FastAPI, this application provides natural language-based product search and filtering.

** Deployed Link -https://ai-product-recommender-z0zm.onrender.com/

## Features

- **AI-Powered Search**: Natural language query processing using Google Gemini 2.5 Flash
- **Smart Filtering**: Tiered search algorithm prioritizing product name and category matches
- **Modern UI**: Amazon-inspired interface with product cards, ratings, and filters
- **Shopping Cart**: Add/remove items with real-time cart management
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

**Frontend:**

- React 18 with Hooks
- Vite (Build tool)
- Lucide React (Icons)

**Backend:**

- FastAPI (Python web framework)
- Google Gemini API (AI recommendations)
- Pydantic (Data validation)

## Prerequisites

- Python 3.8+
- Node.js 16+
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ai-product-recommender
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Start the server
uvicorn main:app --reload
```

The backend will run at `http://127.0.0.1:8000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:3000`

## Usage

1. **Browse Products**: View all 25+ products on the home page
2. **Search with AI**: Enter natural language queries like:
   - "I want a phone under $500"
   - "Gaming laptop for professionals"
   - "Cheap headphones for music"
3. **Filter Results**: Use sidebar filters for category, price, and ratings
4. **Add to Cart**: Click "Add to Cart" on any product

## Project Structure

```
├── main.py                 # FastAPI application
├── gemini_client.py        # Gemini API client
├── products.json           # Product database
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
└── frontend/
    ├── src/
    │   ├── App.jsx         # Main React component
    │   ├── main.jsx        # Entry point
    │   └── index.css       # Styles
    ├── package.json        # Node dependencies
    └── vite.config.js      # Vite configuration
```

## How It Works

1. User enters a natural language query
2. Backend sends query + product catalog to Gemini AI
3. AI analyzes semantic meaning and returns matching product IDs
4. Backend filters products and returns results
5. If AI fails, fallback keyword search activates
6. Frontend displays filtered products

## Environment Variables

| Variable         | Description                |
| ---------------- | -------------------------- |
| `GEMINI_API_KEY` | Your Google Gemini API key |


