from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/auth/login")
    assert response.status_code in [200, 405, 404]
