import json
from typing import List, Optional
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gemini_client import gemini_client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Product(BaseModel):
    id: int
    name: str
    price: float
    category: str
    description: str
    rating: float
    reviews: int
    image: str
    is_prime: bool

def load_products():
    with open('products.json', 'r') as f:
        return json.load(f)

products = load_products()

class RecommendationRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"message": "Product Recommendation API is running"}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(content=b"", media_type="image/x-icon")

@app.get("/products", response_model=List[Product])
def get_products():
    return products

@app.post("/recommend", response_model=List[Product])
def recommend_products(request: RecommendationRequest):
    user_query = request.query
    
    products_summary = [
        {"id": p["id"], "name": p["name"], "category": p["category"], "description": p["description"]} 
        for p in products
    ]
    products_json = json.dumps(products_summary)
    
    prompt = f"""
    You are a helpful shopping assistant.
    The user is looking for products based on this query: "{user_query}"
    
    Here is the list of available products in JSON format:
    {products_json}
    
    Return a JSON array containing ONLY the IDs of the products that best match the user's query.
    If no products match significantly, return an empty array.
    Do not include any explanation, just the JSON array of integers.
    Example response: [1, 3, 5]
    """

    try:
        response = gemini_client.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        content = response.text.strip()
        
        if content.startswith("```"):
            content = content.strip("`")
            if content.startswith("json"):
                content = content[4:]
        
        recommended_ids = json.loads(content)
        
        if not isinstance(recommended_ids, list):
            import re
            match = re.search(r'\[.*\]', content, re.DOTALL)
            if match:
                recommended_ids = json.loads(match.group())
            else:
                raise ValueError("AI did not return a list")

        filtered_products = [p for p in products if p["id"] in recommended_ids]
        
        return filtered_products

    except Exception as e:
        print(f"Error generating recommendations: {e}")
        keywords = user_query.lower().split()
        name_matches = []
        desc_matches = []
        
        for p in products:
            text_primary = (p["name"] + " " + p["category"]).lower()
            match_primary = False
            for k in keywords:
                if k in text_primary:
                    match_primary = True
                    break
                if k.endswith('s') and k[:-1] in text_primary:
                    match_primary = True
                    break
            
            if match_primary:
                name_matches.append(p)
                continue
                
            text_desc = p["description"].lower()
            match_desc = False
            for k in keywords:
                if k in text_desc:
                    match_desc = True
                    break
                if k.endswith('s') and k[:-1] in text_desc:
                    match_desc = True
                    break
            
            if match_desc:
                desc_matches.append(p)

        return name_matches if name_matches else desc_matches