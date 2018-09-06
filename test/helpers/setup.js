import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'whatwg-fetch';

Enzyme.configure({ adapter: new Adapter() });
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

// Default to mocked backend for tests
process.env.GOV_BACKED = 'mock';
