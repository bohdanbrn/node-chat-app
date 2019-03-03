const socket = io()

// socket.on('countUpdated', (count) => { 
//     console.log('The count has been updated!', count);
// });

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment');
// })

socket.on('message', (message) => {
    console.log(message);
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    let message = e.target.elements.message.value

    console.log(message);

    // socket.emit('sendMessage', message)
    // console.log(this);
})