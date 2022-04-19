const users =[]

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    //clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate the data
    if (!username || !room) {
        return {
            error: 'username and room are required'
        }
    }

    // check for existing user
    const existingUser = users.find((user)=> {
        return user.room === room && user.username === username
    })

    // validate username
    if(existingUser){
        return {
            error: 'username is in use!'
        }
    }

    // store user 
    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id)=> {
  const index= users.findIndex((user)=> {
      return user.id === id
  })

  if(index !== -1){
      return users.splice(index, 1)[0]
  }
}

const getUser = (id) =>{
    return users.find(user => user.id === id)
  }
  
  const getUsersInRoom = (room) => {
      room = room.trim().toLowerCase()
     return users.filter(user => {
        return user.room === room
      })
  }


addUser({
    id: 22,
    username: 'Andrew  ',
    room: '  south philly'
})

addUser({
    id: 42,
    username: 'Mike ',
    room: ' south philly'
})

addUser({
    id: 32,
    username: 'Andrew ',
    room: ' Center City'
})



console.log(getUsersInRoom('Center City'))
// console.log(getUser(2))

// console.log(users)

// const removedUser= removeUser(22)

// console.log(removedUser)
// console.log(users)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}