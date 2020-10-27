import useRealm from './useRealm'

describe('useSyncedRealm', () => {
  it('returns a synced realm when given a valid sync config', () => {
    expect(true).toBe(false);  
  })
  it('returns an error when given a valid local config', () => {
    expect(true).toBe(false);  
  })
  it('returns an error when given an invalid config', () => {
    expect(true).toBe(false);  
  })
})

describe('useLocalRealm', () => {
  it('returns a non-sync realm when given a valid local config', () => {
    expect(true).toBe(false);  
  })
  it('returns an error when given a valid sync config', () => {
    expect(true).toBe(false);  
  })
  it('returns an error when given an invalid config', () => {
    expect(true).toBe(false);  
  })
})

describe('useRealm', () => {
  it('returns a synced realm when given a valid sync config', () => {
    expect(true).toBe(false);  
  })
  it('returns a non-sync realm when given a valid local config', () => {
    expect(true).toBe(false);  
  })
  it('returns an error when given an invalid config', () => {
    expect(true).toBe(false);  
  })
})
