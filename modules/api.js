const BASE_URL = 'https://api.torn.com';

class Torn {

  constructor(key) {
    this.key = key;
  }

  items() {
    // let url = `${BASE_URL}/user?&key=${this.key}&selections=networth`
    let url = `${BASE_URL}/torn?&key=${this.key}&selections=items`;
    return fetch(url).then((response) => response.json());
  }

  itemPrice(id) {
    let url = `${BASE_URL}/market/${id}?&key=${this.key}&selections=bazaar,itemmarket`
    return fetch(url).then((response) => response.json());
  }
}

export { Torn }