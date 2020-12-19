/**
 * The a-memory-game web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

// Create all the needed URLs for the game.
const BACKSIDE_URL = (new URL('img/memory-game-00.png', import.meta.url)).href

const IMG_URLS = []

const maxImages = 8

for (let i = 1; i <= maxImages; i++) {
    const IMG = (new URL(`img/memory-game-0${i}.png`, import.meta.url)).href
    IMG_URLS.push(IMG)
}

/**
 * Define the template
 */
const template = document.createElement('template')
template.innerHTML = `
  <style> 
  :host {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    color: #222222;
  }

  #startMenu, #resultWrapper, #gridWrapper {
    display: block;
    padding: 15px;
    padding-bottom: 30px;
    text-align: center;
    background-color: cadetblue;
    box-shadow: 0px 10px 30px;
  }

  ul {
    margin: 0px;
    padding: 0px;
  }

  li {
    list-style: none;   
    display: inline-block;   
  }

  button {
    display: block;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    margin: 5px;
    background-color: #fff39c;
    border-radius: 5px;  
    border: 3px solid #CCCCCC; 
  }

  button:focus, button:hover {
    outline: none;
    box-shadow: 0px 10px 30px;
    border: 3px solid #222222; 
  }

  #resetButton {
    margin: 0 auto;
  }

  #grid2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
  }

  #grid4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-items: center;
  }

  some-tiles::part(backSide) {
    background-image: url("${BACKSIDE_URL}");
    background-color: #fff39c;
  }

  some-tiles {
    width: 100px;
    height: 120px;
  }

  #startMenu.hidden, .hidden {
      display: none;
  }
  </style>

  <div id="mainWrapper">
    <div id="startMenu">
        <h1>Choose your game:</h1>
        <ul>
            <li><button type="button" id="buttonSmall">2x2</button></li>
            <li><button type="button" id="buttonMedium">4x2</button></li>
            <li><button type="button" id="buttonBig">4x4</button></li>
        </ul>
    </div>
    <div id="resultWrapper">
        <h1>You made it!</h1>
        <button type="button" id="resetButton">Reset</button>
    </div>
    <div id="gridWrapper"></div>
  </div>
`

/**
 * Define the custom element.
 */
customElements.define('a-memory-game',
  /**
   * Anonymous class of this element.
   */
  class extends HTMLElement {
    /**
     * Makes an instance of this type.
     */
    constructor () {
      super()

      // Attach shadow and append template.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this._cardsInPlay = 0
      this._images = []

      this._app = this.shadowRoot.querySelector('#mainWrapper')
      this._startMenu = this.shadowRoot.querySelector('#startMenu')
      this._grid = this.shadowRoot.querySelector('#gridWrapper')
      this._results = this.shadowRoot.querySelector('#resultWrapper')

      this._onClick = this._onClick.bind(this)
      this._startGame = this._startGame.bind(this)
      this._renderGrid = this._renderGrid.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._startMenu.addEventListener('click', this._startGame)
      this._results.addEventListener('click', this._onClick)
      this._grid.addEventListener('flippingCard', this._flipCheck)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._startMenu.removeEventListener('click', this._startGame)
      this._results.removeEventListener('click', this._onClick)
      this._grid.removeEventListener('flippingCard', this._flipCheck)
    }

    _onClick (event) {
        console.log('Resetting the game...')
        // When clicking the reset button.
        if (event.target.id === 'resetButton') {
            this._resetGame()
            // Stop timer
        }
    }

    /**
     * Takes care of click-event for starting the game.
     *
     * @param {Event} event - A 'click' event.
     */
    _startGame (event) {
        console.log('Start game!')
        let gameMode = ''

        // When choosing which game to start.
        if (event.target.id === 'buttonSmall') {
            this._cardsInPlay = 4
            gameMode = 'small'
        } else if (event.target.id === 'buttonMedium') {
            this._cardsInPlay = 8
            gameMode = 'medium'
        } else if (event.target.id === 'buttonBig') {
            this._cardsInPlay = 16
            gameMode = 'big'
        }

        this._createImages()
        this._renderGrid(gameMode)
        // Start timer
        
    }

    /**
     * Handles event when a card is flipped.
     *
     * @param {Event} event - 
     */
    _flipCheck (event) {
        console.log('A card was flipped!')
    }

    /**
     * Fill array with image URLs in random order.
     *
     * @returns {array} - Array with image URLs for this game round.
     */
    _createImages () {
        // Get the number of the first unique image URLs to use.
        const imagesToUse = this._cardsInPlay/2

        // Then add them to the main images-array.
        for (let i = 0; i < imagesToUse; i++) {
            const image = IMG_URLS[i]
            this._images.push(image)
        }
        
        // Copy the images to the array to create the pair.
        const copy = this._images
        this._images.push(...copy)
        // console.log(this._images)

        // Now mix them up in a random order using the fisher yates algorithm.
        let newPlacing, temporaryPlacing

        for (let i = this._images.length-1; i > 0; i--) {
            newPlacing = Math.floor(Math.random() * (i + 1))
            temporaryPlacing = this._images[i]
            this._images[i] = this._images[newPlacing]
            this._images[newPlacing] = temporaryPlacing
        }

        return this._images
    }

    /**
     * Reset the game and go back to the starting menu.
     *
     */
    _resetGame () {
        // Remove all  html within the grid wrapper.
        this._grid.innerHTML = ''

        // Reset number of cards in play.
        this._cardsInPlay = 0

        // Empty the array of current images.
        this._images = []

        // Display the starting menu.
        this._startMenu.classList.remove('hidden')

        // And hide the results.
        // this._results.classList.add('hidden')
    }

    /**
     * Render out cards for current game.
     *
     * @param {string} gameMode - What size of grid should be displayed.
     */
    _renderGrid(gameMode) {
        // Hide the starting page.
        // this._startMenu.classList.add('hidden')

        // Create a div for the grid and add grid with size depending on gameMode.
        const grid = document.createElement('div')

        if (gameMode === 'small') {
            // grid Id styled with number of columns.
            grid.setAttribute('id', 'grid2')

            this._grid.appendChild(grid)
        } else {
            // Both the medium and big gameMode has the same nr of columns.
            grid.setAttribute('id', 'grid4')

            this._grid.appendChild(grid)
        }

        // Create some-tiles and img elements and fill the grid with them.
        for (let i = 0; i < this._cardsInPlay; i++) {
            const tile = document.createElement('some-tiles')
            const image = document.createElement('img')

            // Use the links from the image-array to set the image's src.
            const srcLink = this._images[i]
            image.setAttribute('src', `${srcLink}`)

            tile.appendChild(image)
            grid.appendChild(tile)
        }
    }
 })
