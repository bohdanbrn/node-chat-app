const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButtons = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')

socket.on('message', (message) => {
    console.log(message)
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