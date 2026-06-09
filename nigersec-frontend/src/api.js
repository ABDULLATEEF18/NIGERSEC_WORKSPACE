const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function apiRequest(path, { method = 'GET', body, token, headers = {}, institutionId } = {}) {
  const init = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    init.headers.Authorization = `Bearer ${token}`;
  }
  if (institutionId) {
    init.headers['X-Institution-Id'] = institutionId;
  }
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, init);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error || payload?.message || response.statusText;
    throw new Error(message);
  }

  return payload?.data ?? payload;
}

export async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function register(credentials) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: credentials,
  });
}

export async function refreshToken(refreshToken) {
  return apiRequest('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
}

export async function logout(token) {
  return apiRequest('/auth/logout', {
    method: 'POST',
    token,
  });
}

export async function checkBreach(type, identifier) {
  return apiRequest('/citizen/breach/check', {
    method: 'POST',
    body: {
      identifier,
      dataType: type.toUpperCase(),
    },
  });
}

export async function getSubscriptions(token) {
  return apiRequest('/citizen/monitoring', {
    method: 'GET',
    token,
  });
}

export async function subscribeMonitoring(token, payload) {
  return apiRequest('/citizen/monitoring/subscribe', {
    method: 'POST',
    token,
    body: payload,
  });
}

export async function getCriticalAlerts(token, institutionId) {
  return apiRequest('/institution/threat-feed/critical', {
    method: 'GET',
    token,
    institutionId,
  });
}

export async function getThreatFeed(token, institutionId, filters = {}) {
  const params = new URLSearchParams();
  if (filters.attackType) params.append('attackType', filters.attackType);
  if (filters.severity) params.append('severity', filters.severity);
  if (filters.page != null) params.append('page', String(filters.page));
  if (filters.size != null) params.append('size', String(filters.size));
  const query = params.toString();
  return apiRequest(`/institution/threat-feed${query ? `?${query}` : ''}`, {
    method: 'GET',
    token,
    institutionId,
  });
}

export async function getComplianceReport(token, institutionId, year, month) {
  return apiRequest(`/institution/compliance-report/${institutionId}?year=${year}&month=${month}`, {
    method: 'GET',
    token,
    institutionId,
  });
}

export async function submitThreatReport(token, institutionId, payload) {
  return apiRequest('/institution/threat-reports', {
    method: 'POST',
    token,
    institutionId,
    body: payload,
  });
}
