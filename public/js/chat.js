const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButtons = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    console.log('containerHeight', containerHeight);
    console.log('newMessageHeight', newMessageHeight);
    console.log('scrollOffset', scrollOffset);

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('DD.MMMM HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('LocationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('DD.MMMM HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    $sidebar.innerHTML = "";

    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.insertAdjacentHTML('beforeend', html)
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // disable submit button
    $messageFormButtons.setAttribute('disabled', 'disabled')

    let message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        // enable submit button
        $messageFormButtons.removeAttribute('disabled')

        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log("Message delivered!")
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.")
    }

    // disable Send location button
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            // enable Send location button
            $sendLocationButton.removeAttribute('disabled')

            if (error) {
                return console.log(error)
            }

            console.log("Location shared!")
        })
    })
})

socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
