export default class Users {
    constructor(){
        this.users = [];
    }

    get = () => {
        return this.users;
    }

    post = (user) => {
        this.users.push(user);
        return true;
    }
}