const {getUsersInRoom} = require('./users')

const rooms = []

/**
 * Add new room to array
 */
const addRoom = (roomName) => {
    // Clean the data
    roomName = roomName.trim().toLowerCase()

    // Validate the data
    if (!roomName ) {
        return {
            error: "Room name is required!"
        }
    }

    const existingRoom = rooms.find((room) => {
        return room.name == roomName
    })

    if (existingRoom) {
        return {
            error: "Room name is already exists!"
        }
    }

    // Store room
    const room = {
        name: roomName
    }
    rooms.push(room)
    return {room}
}

/**
 * Get existing rooms
 */
const getRooms = () => {
    return rooms
}

/**
 * Get rooms data (name, usersCount)
 */
const getRoomsData = () => {
    let roomsData = []

    rooms.forEach((room) => {
        let roomUsers = getUsersInRoom(room.name)

        roomsData.push({
            name: room.name,
            usersCount: roomUsers.length
        })
    })

    return roomsData
}

/**
 * Remove room from rooms array
 */
const removeRoom = (roomName) => {
    const index = rooms.findIndex((room) => room.name === roomName)

    if (index !== -1) {
        return rooms.splice(index, 1)[0]
    }
}

module.exports = {
    addRoom,
    getRooms,
    getRoomsData,
    removeRoom
}