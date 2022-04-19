const socket= io()

// client(emit) -> server(recieve) --> bb3t acknowledgment ll client enu wslo
// server(emit) -> client(recieve) --> bb3t acknowledgment ll server enu wslo

// Elements
const $messageForm= document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $sendLocationButton = document.querySelector('#send-location')

const $messages = document.querySelector('#messages')

// Templates
const messageTemplate =document.querySelector('#message-template').innerHTML
const locationTemplate =document.querySelector('#location-template').innerHTML
const sidebarTemplate =document.querySelector('#sidebar-template').innerHTML

// Options
const {username, room} = Qs.parse(location.search , {ignoreQueryPrefix:true})

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

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('message', (message) => {
    console.log(message)

   const html= Mustache.render(messageTemplate, {
       username: message.username,
       message: message.text,
       createdAt: moment(message.createdAt).format('h:mm a')
   })
   $messages.insertAdjacentHTML('beforeend', html)
   autoscroll()
})

socket.on('locationMessage', (message) => {

   const html= Mustache.render(locationTemplate, {
       username: message.username,
       url: message.url,
       createdAt: moment(message.createdAt).format('h:mm a')
    })
   $messages.insertAdjacentHTML('beforeend', html)
   autoscroll()
})

$messageForm.addEventListener('submit',(e)=> {
    e.preventDefault()

    const message = e.target.elements.message.value

    // disable button
    $messageFormButton.setAttribute('disabled', 'disabled')

    socket.emit('sendMessage' , message, (error)=> {
        // enable
       $messageFormButton.removeAttribute('disabled')
       $messageFormInput.value = ''
       $messageFormInput.focus()

       if (error) {
           return console.log(error)
       }
       console.log('message deliverd!')
    })
})

$sendLocationButton.addEventListener('click', (e)=> {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        
        socket.emit('sendLocation', {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, ()=> {
            console.log('Location shared')
            $sendLocationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join', {username, room}, (error)=> {
    if(error) {
        alert(error)
        location.href= '/'
    }
})
 
socket.on('roomData', ({room, users})=> {
    console.log(room)
    console.log(users)

    const html = Mustache.render(sidebarTemplate , {
        room, 
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})