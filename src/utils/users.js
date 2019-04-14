const users = [];

/**
 * Adds a User to the global Register
 * @param id
 * @param username
 * @param room
 * @returns {{error: string}|{user: {id: *, room: *, username: *}}|{error: string}}
 */
const addUser = ({id, username, room}) => {
    // Clean Data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate data
    if(!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }
    // Check for existing User
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    // Validate User
    if(existingUser) {
        return {
            error: `Username ${username} is in use!`
        }
    }

    // Store User
    const user = { id, username, room };
    users.push(user);
    return {user};
};

/**
 *
 * @param id
 * @returns {(user|undefined)}
 */
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
};

/**
 * Gets the User based on ID
 * @param id int
 * @returns {user}
 */
const getUser = (id) => {
    return users.find((user) => user.id === id);
};

/**
 * Gets all Users in a room based on room name
 * @param room string
 * @returns {user[]}
 */
const getUsersInRoom = (room) =>  {
    return users.filter((user) => user.room === room);
};

/**
 * Exports all Methods of the User Util File
 * @type {{getUsersInRoom: (function(*): (user[] | *[])), removeUser: removeUser, addUser: addUser, getUser: (function(*): (user|*))}}
 */
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};