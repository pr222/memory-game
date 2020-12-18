/**
 * The a-memory-game web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const backImg = (new URL('img/0.png', import.meta.url)).href

/**
 * Define the template
 */
const template = document.createElement('template')
template.innerHTML = `
  <style> 

  #buttonMenu {
      display: block;
      padding: 40px;
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

  li button {
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
      border: 3px solid #8c2323; 
  }

  .hidden {
      display: none;
  }
  </style>

  <!-- TODO: Add html here  -->
  <div id="wrapper">
    <div id="buttonMenu">
        <ul>
            <li><button type="button" id="button2x2">2x2</button></li>
            <li><button type="button" id="button4x2">4x2</button></li>
            <li><button type="button" id="button4x4">4x4</button></li>
        </ul>
    </div>
    <div id="grid2x2"></div>
    <div id="grid4x2"></div>
    <div id="grid4x4"></div>
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

      this._wrapper = this.shadowRoot.querySelector('#wrapper')
      // this._smallGrid = this.shadowRoot.querySelector('#grid2x2')
      // this._mediumGrid = this.shadowRoot.querySelector('#grid4x2')
      // this._bigGrid = this.shadowRoot.querySelector('#grid4x4')     
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._wrapper.addEventListener('click', this._onClick)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._wrapper.removeEventListener('click', this._onClick)
    }

    /**
     * Takes care of click-event.
     *
     * @param {Event} event - A 'click' event.
     */
    _onClick (event) {
        console.log('Click event!')
        if (event.target.id === 'button2x2') {
            console.log('Display a 2x2 grid.')
        } else if (event.target.id === 'button4x2') {
            console.log('Display a 4x2 grid.')
        } else if (event.target.id === 'button4x4') {
            console.log('Display a 4x4 grid.')
        }

    }
 })
