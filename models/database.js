const knexfile = require('../knexfile.js');
const knex = require('knex')(knexfile);
const Queue = require('../queue.js');

var getUser = function(username) {
    return knex.raw(`SELECT * FROM users 
                WHERE username = '${username}'`).then(results => {
                    return results.rows[0]
                })

}

var login = function(username, password) {
    return knex.raw(`SELECT * FROM users
    WHERE username = '${username}'`).then(result=> {
        if (result.rows.length === 0) {
            return Promise.reject(new Error("BadLogin"))
        } else if (result.rows[0].password === password){
            return knex.raw(`SELECT *, (calorie_intake - calorie_spend) as diff 
                                FROM users
                                ORDER BY diff
                            `).then(users=>{
                    // console.log(users.rows)
                return getRelationshipsForUser(username).then(relationships => {
                    users.rows.map(row => {
                        if (relationships.hasOwnProperty(row.username)) {
                            row.relationship = relationships[row.username]
                        }
                    })
                    return users.rows
                })
            })
        }else {
            return Promise.reject(new Error("BadLogin"))
        }
    }).catch(err => {
        if(err.message === 'BadLogin') {
            return [];
        }
    })
}


//Run BFS to get relationships. 
var getRelationshipsForUser = function(username) {
    
    return knex.raw(`SELECT friends.from, string_agg(friends.to, ',') as to
                    FROM friends
                    GROUP BY friends.from`).then(graph => {
        var q = new Queue()
        q.push('username')
        var distance = {};
        adjacency_lists = {}
        graph.rows.forEach(elt => {
            adjacency_lists[elt.from] = elt.to.split(',')
        })
        q.push(username)
        distance[username] = 0;
        while (!q.isEmpty()) {
            var node = q.pop();
            if(adjacency_lists.hasOwnProperty(node)) {
                adjacency_lists[node].forEach(element => {
                    if (!distance.hasOwnProperty(element)) {
                        if (distance[node] + 1 > 5) {
                            return distance;
                        }
                        distance[element] = distance[node]+1
                        q.push(element) 
                    }
                })
            }
            
        }
        return distance
    })
}

var signUp = function(username, password) {
    return knex('users')
        .returning(['username', 'calorie_intake', 'calorie_spend'])
        .insert({username, password, calorie_intake:0, calorie_spend:0})
        .then(result => {
            return result[0]
        }).catch(function(error) {
            // Same error object as the query-error event provides.
            return {};
          });

}

var addFriend = function(user, friend) {
    return knex('friends')
        .returning(['from', 'to'])
        .insert([{from: user, to: friend}, {from: friend, to:user}])
        .then(result => {
            return result
        }).catch(function(error) {
            // Same error object as the query-error event provides.
            return {};
          });
}

var addIntake = function(user, intake) {
    return knex('users')
    .returning(['username', 'calorie_intake', 'calorie_spend'])
    .update({
        calorie_intake: knex.raw('?? + ' + intake, ['calorie_intake'])
    }).where('username', user).then(result => {
        return getNewRanking().then(users => {
            return users
        })
    }).catch(error=>{
        console.log(error)
        return {};
    })
}

//Really should account for corner case where it becomes negative
var removeIntake = function(user, intake) {
    return knex('users')
    .returning(['username', 'calorie_intake', 'calorie_spend'])
    .update({
        calorie_intake: knex.raw('?? - ' + intake, ['calorie_intake'])
    }).where('username', user).then(result => {
        return getNewRanking().then(users => {
            return users
        })
    }).catch(error=>{
        console.log(error)
        return {};
    })
}

var addSpend = function(user, spend) {
    return knex('users')
    .returning(['username', 'calorie_intake', 'calorie_spend'])
    .update({
        calorie_spend: knex.raw('?? + ' + spend, ['calorie_spend'])
    }).where('username', user).then(result => {
        return getNewRanking().then(users => {
            return users
        })
    }).catch(error=>{
        console.log(error)
        return {};
    })
}


var removeSpend = function(user, spend) {
    return knex('users')
    .returning(['username', 'calorie_intake', 'calorie_spend'])
    .update({
        calorie_spend: knex.raw('?? - ' + spend, ['calorie_spend'])
    }).where('username', user).then(result => {
        return getNewRanking().then(users => {
            return users
        })
    }).catch(error=>{
        console.log(error)
        return {};
    })
}

var getNewRanking = function () {
    return knex.raw(`SELECT *, (calorie_intake - calorie_spend) as diff 
                                FROM users
                                ORDER BY diff
                            `).then(users=>{
                                return users.rows
                            })
}



module.exports = {
    getUser,
    login,
    getRelationshipsForUser,
    signUp,
    addFriend,
    addIntake,
    removeIntake,
    addSpend,
    removeSpend
}