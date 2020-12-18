/**
 * The a-memory-game web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const backImg = (new URL('img/0.png', import.meta.url)).href
let nrOfCards = 0

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

  #startMenu, #resultWrapper {
      display: block;
      padding: 15px;
      padding-bottom: 30px;
      text-align: center;
      background-color: cadetblue;
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

  #startMenu.hidden, .hidden {
      display: none;
  }
  </style>

  <!-- TODO: Add html here  -->
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

      this._app = this.shadowRoot.querySelector('#mainWrapper')
      this._startMenu = this.shadowRoot.querySelector('#startMenu')
      this._grid = this.shadowRoot.querySelector('#gridWrapper')

      this._onClick = this._onClick.bind(this)
      this._renderGrid = this._renderGrid.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._app.addEventListener('click', this._onClick)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._app.removeEventListener('click', this._onClick)
    }

    /**
     * Takes care of click-events.
     *
     * @param {Event} event - A 'click' event.
     */
    _onClick (event) {
        console.log('Click event!')

        // When choosing which game to start.
        if (event.target.id === 'buttonSmall') {
            nrOfCards = 4
            this._renderGrid('small')
            // Start timer
        } else if (event.target.id === 'buttonMedium') {
            nrOfCards = 8
            this._renderGrid('medium')
            // Start timer
        } else if (event.target.id === 'buttonBig') {
            nrOfCards = 16
            this._renderGrid('big')
            // Start timer
        }

        // When clicking the reset button.
        if (event.target.id === 'resetButton') {
            this._resetGame()
            // Stop timer
        }
    }

    /**
     * Reset the game and go back to the starting menu.
     *
     */
    _resetGame () {
        // Remove all  html within the grid wrapper.
        this._grid.innerHTML = ''

        // Reset number of cards in play.
        nrOfCards = 0

        // Display the starting menu.
        this._startMenu.classList.remove('hidden')
    }

    /**
     * Render out cards for current game.
     *
     * @param {string} grid - What type of grid should be displayed.
     */
    _renderGrid(newGrid) {
        // this._startMenu.classList.add('hidden')
        const grid = document.createElement('div')

        if (newGrid === 'small') {
            grid.setAttribute('id', 'grid2')

            this._grid.appendChild(grid)

            // Fill grid up to 2x2.
            for (let i = 0; i < nrOfCards; i++) {
                    const anImg = document.createElement('some-tiles')
                    grid.appendChild(anImg)
                }
        } else {
            // Both medium and big grids has the same nr of columns.
            grid.setAttribute('id', 'grid4')

            this._grid.appendChild(grid)

            if (newGrid === 'medium') {
                // Fill grid up to 4x2.
                for (let i = 0; i < nrOfCards; i++) {
                    const anImg = document.createElement('some-tiles')
                    grid.appendChild(anImg)
                }
            } else {
                // Fill grid up to 4x4.
                for (let i = 0; i < nrOfCards; i++) {
                    const anImg = document.createElement('some-tiles')
                    grid.appendChild(anImg)
                }
            }
        } 
    }
 })
