import { Torn } from './modules/api.js';
import {
  IDS_HOLIDAY_ITEMS,
  IDS_MR_MRS_TORN,
  IDS_MASKS,
  IDS_COINS,
  IDS_STAFF_COLLECTIBLES
} from './modules/items.js';

// estimates based on a assumption that Staff collectibles with 20 in circulation are worth 2 bil
const ESTIMATE_BASE_CIRCULATION = 20;
const ESTIMATE_BASE_PRICE = 2000000000;

let items = [];
let prices = {};
let key = '';

async function load() {
  key = document.getElementById('api-key').value;
  if (key === undefined || key.length === 0) {
    alert('key is required');
    return;
  }
  let torn = new Torn(key);
  let response = await torn.items();
  items = _mapObjectToArray(response.items);

  _filteredItems(items).forEach(item => loadPrice(item.id));
}

async function loadPrice(id) {
  let torn = new Torn(key);
  let response = await torn.itemPrice(id);

  let priceBazaar = response.bazaar === null ? 0 : response.bazaar[0].cost;
  let priceItemMarket = response.itemmarket === null ? 0 : response.itemmarket[0].cost;
  let price = Math.max(priceBazaar, priceItemMarket);

  // if price isn't available, set to null, otherwise set price
  if (price === 0) {
    price = null
  }
  prices[id.toString()] = price;

  _renderContent();
}

function _renderContent() {
  let html = '';
  _sortItemsByCirculation(_filteredItems(items))
    .reverse()
    .forEach(item => {
      html += `<tr id="${item.id}">
      <td><img src="${item.image}"/></td>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.circulation}</td>
      <td>todo:</td>
      <td>todo:</td>
      <td>${getEstimatedValue(item.circulation)}</td>
      <td>${getLowestPrice(item.id)}</td>
      <td>${getPriceToValue(item)}</td>
      <td>todo:</td>
    </tr>`;
    });

  document.getElementById('table-content').innerHTML = html;
}

function _mapObjectToArray(object) {
  let output = [];
  for (const [key, value] of Object.entries(object)) {
    output.push({
      id: Number(key),
      ...value
    });
  }
  return output;
}

function _filteredItems(items) {
  // return items;
  return items.filter(item =>
    IDS_HOLIDAY_ITEMS.includes(item.id)
    // || IDS_MR_MRS_TORN.includes(item.id)
    || IDS_MASKS.includes(item.id)
    // || IDS_COINS.includes(item.id)
    // || IDS_STAFF_COLLECTIBLES.includes(item.id)
  );
}

function _sortItemsByCirculation(items) {
  return items.sort((a, b) => {
    if (a.circulation < b.circulation) {
      return - 1;
    }

    if (a.circulation > b.circulation) {
      return 1;
    }

    return 0;
  });
}

function getLowestPrice(id) {
  let price = prices[id.toString()];
  if (price === undefined || price === null) {
    return 'N/A';
  }

  return prices[id.toString()].toLocaleString();
}

function getPriceToValue(item) {
  let price = prices[item.id.toString()];
  if (price === undefined || price === null) {
    return 'N/A';
  }

  let estimate = getEstimatedValue(item.circulation);

  return (price / estimate * 100).toFixed(0);
}

function getEstimatedValue(circulation) {
  let price = (ESTIMATE_BASE_PRICE / (circulation / ESTIMATE_BASE_CIRCULATION));
  return Number(price.toFixed(0));
}

window.load = load;