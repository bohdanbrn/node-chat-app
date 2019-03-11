const socket = io()

const $roomsList = document.querySelector('#rooms-list')

// Templates
const roomListTemplate = document.querySelector('#room-list-template').innerHTML

socket.emit('getRooms', () => {
    console.log('Rooms received')
})

socket.on('roomList', (roomList) => {
    if (Array.isArray(roomList)){
        roomList.forEach((room) => {
            let html = Mustache.render(roomListTemplate, {
                roomName: room.name,
                usersCount: room.usersCount
            })

            $roomsList.insertAdjacentHTML('beforeend', html)
        })
    }
})