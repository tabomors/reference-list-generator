const R = require('ramda');

const POSSIBLE_PAGES_COUNT = [215, 220, 230, 234, 265, 275, 305, 310, 325, 345, 375, 410, 420]; 

function formatBooksData(data, startIndex) {
  return R.pipe(
    R.reduce((acc, item) => acc.concat(item), []),
    shuffle,
    R.addIndex(R.map)(formatBook(startIndex)),
    R.join('\n'))
    (data);
}

function formatBook(startIndex) {
  return ({ author, title, date }, i) => {
    const newIndex = startIndex + i;
    return `[${newIndex}] ${author} / ${title}, ${date} г.`;
  }
}

function getRandomPagesCount() { return POSSIBLE_PAGES_COUNT[Math.floor(Math.random() * POSSIBLE_PAGES_COUNT.length)] };

// Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function ppObject(obj) {
  return JSON.stringify(obj, null, '\t');
}

module.exports = { formatBooksData, getRandomPagesCount };