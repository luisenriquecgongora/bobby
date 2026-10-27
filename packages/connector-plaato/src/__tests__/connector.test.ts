import { describe, it, expect, beforeEach } from 'vitest';
import { PlaatoConnector } from '../index';

describe('PlaatoConnector Cloud Adapter', () => {
  let connector: PlaatoConnector;

  beforeEach(() => {
    connector = new PlaatoConnector({
      apiBase: 'https://api-takient.onrender.com/',
      token: 'test-jwt-token',
      businessId: 'biz_123',
    });
  });

  it('normalizes trailing slashes on apiBase', () => {
    expect(connector.apiBase).toBe('https://api-takient.onrender.com');
  });

  it('stores and updates token and business ID', () => {
    expect(connector.token).toBe('test-jwt-token');
    expect(connector.businessId).toBe('biz_123');

    connector.setToken('new-token');
    connector.setBusinessId('biz_456');

    expect(connector.token).toBe('new-token');
    expect(connector.businessId).toBe('biz_456');
  });

  it('uses default fallback apiBase when none is provided', () => {
    const defaultConn = new PlaatoConnector();
    expect(defaultConn.apiBase).toBe('https://api-takient.onrender.com');
    expect(defaultConn.token).toBe('');
    expect(defaultConn.businessId).toBe('');
  });
});
