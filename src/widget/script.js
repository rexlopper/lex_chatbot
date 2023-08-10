/**
 * @fileoverview This file contains the main script file for the widget.
 * @author Rex Von Brixon Aparece Apa-ap
 * @version 1.0.0
 */
const AmazonLexV2 = require('./chat.js')
const textarea = document.querySelector('.chatbox-message-input')
const chatboxForm = document.querySelector('.chatbox-message-form')
const chatboxToggle = document.querySelector('.chatbox-toggle')
const chatboxMessage = document.querySelector('.chatbox-message-wrapper')
const chatboxMessageWrapper = document.querySelector('.chatbox-message-content')
const chatboxNoMessage = document.querySelector('.chatbox-message-no-message')
const loading = document.querySelector(".loading")

/**
 * Event listener for the text area.
 */
textarea.addEventListener('input', function () {
	var line = textarea.value.split('\n').length

	if(textarea.rows < 7 || line < 7) {
		textarea.rows = line
	}

	if(textarea.rows > 1) {
		chatboxForm.style.alignItems = 'flex-end'
	} else {
		chatboxForm.style.alignItems = 'center'
	}
})

/**
 * 
 * @param {Boolean} show If show is True, append hide at the end of the ".loading" class.
 */
const toggleLoading=(show)=>loading.classList.toggle("hide", show)

/**
 * Event listening for the chatbox toggle. If the robot icon is click,
 * the entire chatbox will appear.
 */
chatboxToggle.addEventListener('click', function () {
	chatboxMessage.classList.toggle('show')
})

// DROPDOWN TOGGLE
const dropdownToggle = document.querySelector('.chatbox-message-dropdown-toggle')
const dropdownMenu = document.querySelector('.chatbox-message-dropdown-menu')

/**
 * Event listener for the dropdownToggle. Once click, the dropdown menu on the
 * upper right of the chatbox will appear.
 */
dropdownToggle.addEventListener('click', function () {
	dropdownMenu.classList.toggle('show')

})


/**
 * Even listener to catch if there's any click outside the dropdown menu.
 * If dropdown menu is enable and a click outside was caught, the dropdown menu,
 * will minimize.
 */
document.addEventListener('click', function (e) {
	if(!e.target.matches('.chatbox-message-dropdown, .chatbox-message-dropdown *')) {
		dropdownMenu.classList.remove('show')
	}
})


/**
 * 
 * @param {String} message Message to be sent to lex thru our class method.
 */
function chatLex(message) {
	var chatbot = new AmazonLexV2();
	const response = chatbot.sendTextMessageToAWS(message, "10000").then(data => {
		setReplies(data['messages'])
		}
	)
}

/**
 * 
 * @param {String} reply Message received from lex.
 */
function textReply(reply){
	const today = new Date()
	let message = `
		<div class="chatbox-message-item received">
			<span class="chatbox-message-item-text">
				${reply}
			</span>
		<span class="chatbox-message-item-time">${prefixZero(today.getHours())}:${prefixZero(today.getMinutes())}</span>
		</div>
	`
	setTimeout(()=>{
		botReply(message)
		toggleLoading(true)
	}, 1700)

}

/**
 * 
 * @param {Object} reply Object message for imageResponseCard
 */
function cardReply(reply){
	const today = new Date()
	const responseCard = reply['imageResponseCard']
	const subtitle = responseCard['subtitle']
	let message = `<div class="cta-cardreply">
					<span class="chatbox-message-item-text">
						${subtitle}
					</span>`			
	for (const button of responseCard['buttons']){
		message = message + `<button type="submit" text=${button['text']} value=${button['value']} class="btn-cardreply">${button['text']}</button>`
	}
	message = message + `<span class="chatbox-message-item-time">${prefixZero(today.getHours())}:${prefixZero(today.getMinutes())}</span>
						</div>`

	setTimeout(()=>{
		botReply(message)
		toggleLoading(true)
	}, 1700)
}

/**
 * 
 * @param {Array} messages An array of messages received from lex.
 */
function setReplies(messages) {
	for (const message of messages) {
		toggleLoading(false)
		const content = message['content']
		if (content!==undefined) {
			textReply(content)
		} else {
			cardReply(message)
		}
	}

}

/**
 * Event listener to catch any submit made within chatbox form area.
 * This will trigger to write the message in the UI and send the message to lex.
 */
chatboxForm.addEventListener('submit', function (e) {
	e.preventDefault()
	if(isValid(textarea.value)) {
		const text = textarea.value
		writeMessage()
		chatLex(text)
	}
})

/**
 * Even listener to catch any click made within the chatbox content area.
 * If the click is made on the "btn-cardreply" class, send chosen option within the button to lex.
 */
chatboxMessageWrapper.addEventListener('click', function (e) {
	if(e.target.className === "btn-cardreply"){
		chatLex(e.target.value)
	}
	e.preventDefault()
})

/**
 * 
 * @param {String} reply Html snippet for the bot message.
 */
function botReply(reply) {
	chatboxMessageWrapper.insertAdjacentHTML('beforeend', reply)
	scrollBottom()
}

/**
 * 
 * @param {Number} num If hour side if <10, add a "0" prefix to maintain uniformity.
 */
function prefixZero(num) {
	return num < 10 ? '0'+num : num
}


/**
 * Create an html snippet from the message on the text area and append it inside the message wrapper.
 */
function writeMessage() {
	const today = new Date()
	let message = `
		<div class="chatbox-message-item sent">
			<span class="chatbox-message-item-text">
				${textarea.value.trim().replace(/\n/g, '<br>\n')}
			</span>
			<span class="chatbox-message-item-time">${prefixZero(today.getHours())}:${prefixZero(today.getMinutes())}</span>
		</div>
	`
	chatboxMessageWrapper.insertAdjacentHTML('beforeend', message)
	chatboxForm.style.alignItems = 'center'
	textarea.rows = 1
	textarea.focus()
	textarea.value = ''
	chatboxNoMessage.style.display = 'none'
	scrollBottom()
}

/**
 * Automatically scrolls to bottom of chat evertime there is a new message.
 */
function scrollBottom() {
	chatboxMessageWrapper.scrollTo(0, chatboxMessageWrapper.scrollHeight)
}

/**
 * 
 * @param {String} value Value from the text area to be checked if it's a valid message.
 */
function isValid(value) {
	// will ignore empty spaces or newlines
	let text = value.replace(/\n/g, '')
	text = text.replace(/\s/g, '')

	return text.length > 0
}