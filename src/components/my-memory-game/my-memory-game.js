/**
 * The my-memory-game web component module.
 *
 * @author Mats Loock <mats.loock@lnu.se>
 * @version 1.0.0
 */

import '../my-flipping-tile'

/*
 * Get image URLs.
 */
const NUMBER_OF_IMAGES = 9

const IMG_URLS = new Array(NUMBER_OF_IMAGES)
for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
  IMG_URLS[i] = (new URL(`images/${i}.png`, import.meta.url)).href
}

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      --tile-size: 80px;
    }
    #game-board {
      display: grid;
      grid-template-columns: repeat(4, var(--tile-size));
      gap: 20px;
    }
    #game-board.small {
      grid-template-columns: repeat(2, var(--tile-size));
    }
    my-flipping-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }
    my-flipping-tile::part(tile-back) {
      border-width: 5px;
      background: url("${IMG_URLS[0]}") no-repeat center/80%, radial-gradient(#fff, #ffd700);;
    }
  </style>
  <template id="tile-template">
    <my-flipping-tile>
      <img />
    </my-flipping-tile>
  </template>
  <div id="game-board">
  </div>
`

/*
 * Define custom element.
 */
customElements.define('my-memory-game',
  /**
   * Represents a memory game
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the game board element in the shadow root.
      this._gameBoard = this.shadowRoot.querySelector('#game-board')

      // Get the tile template element in the shadow root.
      this._tileTemplate = this.shadowRoot.querySelector('#tile-template')

      this._onTileFlip = this._onTileFlip.bind(this)
    }

    /**
     * Gets the board size.
     *
     * @returns {string} The size of the game board.
     */
    get boardSize () {
      return this.getAttribute('boardsize')
    }

    /**
     * Sets the board size.
     *
     * @param {string} value - The size of the game board.
     */
    set boardSize (value) {
      this.setAttribute('boardsize', value)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['boardsize']
    }

    /**
     * Get the game board size dimensions.
     *
     * @returns {object} The width and height of the game board.
     */
    get _gameBoardSize () {
      const gameBoardSize = {
        width: 4,
        height: 4
      }

      switch (this.boardSize) {
        case 'small' : {
          gameBoardSize.width = gameBoardSize.height = 2
          break
        }

        case 'medium' : {
          gameBoardSize.height = 2
          break
        }
      }

      return gameBoardSize
    }

    /**
     * Get all tiles.
     *
     * @returns {object} An object containing grouped tiles.
     */
    get _tiles () {
      const tiles = Array.from(this._gameBoard.children)
      return {
        all: tiles,
        faceUp: tiles.filter(tile => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: tiles.filter(tile => !tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (!this.hasAttribute('boardsize')) {
        this.setAttribute('boardsize', 'large')
      }

      this._upgradeProperty('boardsize')

      this._gameBoard.addEventListener('tileflip', this._onTileFlip)
      this.addEventListener('dragstart', this._onDragStart)
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'boardsize') {
        this._init()
      }
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      // this._tiles.all.forEach(tile => tile.removeEventListener('flip', this._onFlip))
      this.removeEventListener('tileflip', this._onTileFlip)
      this.removeEventListener('dragstart', this._onDragStart)
    }

    /**
     * Run the specified instance property through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    _upgradeProperty (prop) {
      if (Object.hasOwnProperty.call(this, prop)) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
      }
    }

    /**
     * Initializes the game board size and tiles.
     */
    _init () {
      const { width, height } = this._gameBoardSize

      const tilesCount = width * height

      if (tilesCount !== this._tiles.all.length) {
        // Remove existing tiles, if any.
        while (this._gameBoard.firstChild) {
          this._gameBoard.removeChild(this._gameBoard.lastChild)
        }

        if (width === 2) {
          this._gameBoard.classList.add('small')
        } else {
          this._gameBoard.classList.remove('small')
        }

        // Add tiles.
        for (let i = 0; i < tilesCount; i++) {
          const tile = this._tileTemplate.content.cloneNode(true)
          this._gameBoard.appendChild(tile)
        }
      }

      // Create a sequence of numbers between 0 and 15,
      // and then shuffle the sequence.
      const indexes = [...Array(tilesCount).keys()]

      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]]
      }

      // Set the tiles' images.
      this._tiles.all.forEach((tile, i) => {
        tile.querySelector('img').setAttribute('src', IMG_URLS[indexes[i] % (tilesCount / 2) + 1])
        tile.faceUp = tile.disabled = tile.hidden = false
      })
    }

    /**
     * Handles drag start events. This is needed to prevent the
     * dragging of tiles.
     *
     * @param {DragEvent} event - The drag event.
     */
    _onDragStart (event) {
      // Disable element dragging.
      event.preventDefault()
      event.stopPropagation()
    }

    /**
     * Handles flip events.
     *
     * @param {CustomEvent} event - The custom event.
     */
    _onTileFlip (event) {
      const tiles = this._tiles
      const tilesToDisable = Array.from(tiles.faceUp)

      if (tiles.faceUp.length > 1) {
        tilesToDisable.push(...tiles.faceDown)
      }

      tilesToDisable.forEach(tile => (tile.setAttribute('disabled', '')))

      const [first, second, ...tilesToEnable] = tilesToDisable

      if (second) {
        const isEqual = first.isEqual(second)
        const delay = isEqual ? 1000 : 1500
        window.setTimeout(() => {
          let eventName = 'tilesmismatch'
          if (isEqual) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            eventName = 'tilesmatch'
          } else {
            first.removeAttribute('face-up')
            second.removeAttribute('face-up')
            tilesToEnable.push(first, second)
          }

          this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { first, second }
          }))

          if (tiles.all.every(tile => tile.hidden)) {
            tiles.all.forEach(tile => (tile.disabled = true))
            this.dispatchEvent(new CustomEvent('gameover', {
              bubbles: true
            }))

            this._init()
          } else {
            tilesToEnable?.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, delay)
      }
    }
  }
)
