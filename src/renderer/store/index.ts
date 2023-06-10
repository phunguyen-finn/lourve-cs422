class Store {
  get(key: string) {
    return window.electron.store.get(key);
  }

  set(key: string, val: any) {
    window.electron.store.set(key, val);
  }
}

export const store = new Store();

export default store;