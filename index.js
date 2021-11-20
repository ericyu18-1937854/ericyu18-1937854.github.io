/**
 * Name: Eric Yu
 * Date: 10/18/2021
 * Section: CSE 154 AE
 *
 * This is the javascript file for my roll webpage. It allows the user
 * roll for random pokemons from the first 151 pokemons on the PokeApi.
 */
"use strict";

(function() {

  const URL = 'https://pokeapi.co/api/v2/pokemon/';
  const NUMPOKEMONS = 151;
  const CHANCES = 6;

  /* Add a function that will be called when the window is loaded.*/
  window.addEventListener("load", init);

  /**
   * My init function will initiate all my other functions
   */
  function init() {
    let roll = document.getElementById("roll");
    roll.addEventListener('click', getPokemon);
  }

  /**
   * checks the status of the promise
   * will throw an error the promise is not ok
   * @param {promise} response the promise to use this function
   * @returns {promise} the passed promise
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * handles error, no parameter no return
   * will display anerror message and disable the roll button
   * id there is an error
   */
  function handleErrors() {
    let board = document.getElementById("board");
    let roll = document.getElementById("roll");
    roll.disabled = true;
    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("err");
    let message = document.createElement("h1");
    message.textContent = "Something went wrong, please refreash the page.";
    card.appendChild(message);
    board.replaceChild(card, board.firstElementChild);
  }

  /**
   * Pull the pokemon data from the poke API, than displaying the cards
   * no parameter no return
   */
  function getPokemon() {
    let randPokemon = Math.floor(Math.random() * NUMPOKEMONS);
    fetch(URL + randPokemon)
      .then(statusCheck)
      .then(result => result.json())
      .then(processData)
      .catch(handleErrors);
  }

  /**
   * parse the json data of pokemon into pokemon objects
   * than display the pokemon and their stats
   * there is also a 1 in 6 chance the user will get a shiny
   * @param {json} data the json content of the pokemon
   */
  function processData(data) {
    let pokemon = parsePokemon(data);
    let board = document.getElementById("board");
    board.removeChild(board.lastElementChild);
    let shiny = Math.floor(Math.random() * CHANCES);
    let card = document.createElement("div");
    card.classList.add("card");
    let img = document.createElement("img");
    img.alt = pokemon.name;
    let name = document.createElement("h2");
    let id = document.createElement("span");
    name.textContent = (pokemon.name);
    id.textContent = (" #" + pokemon.id);
    name.appendChild(id);
    let type = document.createElement("h3");
    type.textContent = pokemon.type;
    card.appendChild(name);
    if (shiny === 0) {
      img.src = pokemon.shiny;
      card.classList.add("shiny");
    } else {
      img.src = pokemon.image;
    }
    card.appendChild(img);
    card.appendChild(type);
    board.appendChild(card);
  }

  /**
   * convert the json pokemon data into a pokemon object
   * @param {json} data json data of the pokemon
   * @returns {object} the pokemon object that contains information about the pokemon
   */
  function parsePokemon(data) {
    let pokemon = {
      name: data.name,
      id: data.id,
      type: data.types.map((type) => type.type.name).join(', '),
      image: data.sprites['front_default'],
      shiny: data.sprites['front_shiny']
    };
    return pokemon;
  }

})();