function getUser(id) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ id, name: `User ${id}` }), 10000);
    });
}

function getPosts(userId) {
    return new Promise(resolve => {
        setTimeout(() => resolve([`Post 1 by User ${userId}`, `Post 2 by User ${userId}`]), 1000);
    });
}
const id =5;
async function xyz(id){
    getUser(id).then(function abc(a2){
        getPosts(a2.name).then( function z(cc){
            console.log(cc);
        }
            
        )
    });
}
xyz(id);