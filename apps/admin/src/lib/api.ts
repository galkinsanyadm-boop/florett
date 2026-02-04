const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('florett_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('florett_admin_token');
      window.location.href = '/login';
    }
    const error = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
    throw new Error(error.error || 'Ошибка запроса');
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

// Auth
export async function login(password: string): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return handleResponse(res);
}

// Bouquets
export async function fetchBouquets() {
  const res = await fetch(`${API_BASE}/bouquets`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchBouquet(id: string) {
  const res = await fetch(`${API_BASE}/bouquets/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function createBouquet(data: any) {
  const res = await fetch(`${API_BASE}/bouquets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateBouquet(id: string, data: any) {
  const res = await fetch(`${API_BASE}/bouquets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteBouquet(id: string) {
  const res = await fetch(`${API_BASE}/bouquets/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Reviews
export async function fetchReviews() {
  const res = await fetch(`${API_BASE}/reviews`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function approveReview(id: string, approved: boolean) {
  const res = await fetch(`${API_BASE}/reviews/${id}/approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ approved }),
  });
  return handleResponse(res);
}

export async function deleteReview(id: string) {
  const res = await fetch(`${API_BASE}/reviews/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Orders
export async function fetchOrders(params?: { status?: string; from?: string; to?: string }) {
  const url = new URL(`${API_BASE}/orders`, window.location.origin);
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.from) url.searchParams.set('from', params.from);
  if (params?.to) url.searchParams.set('to', params.to);

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchOrder(id: string) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function updateOrderStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

// Analytics
export async function fetchAnalyticsSummary() {
  const res = await fetch(`${API_BASE}/analytics/summary`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchRevenueData(days = 30) {
  const res = await fetch(`${API_BASE}/analytics/revenue?days=${days}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchPopularBouquets(limit = 5) {
  const res = await fetch(`${API_BASE}/analytics/popular-bouquets?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}
