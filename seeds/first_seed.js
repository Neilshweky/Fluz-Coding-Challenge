
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      return knex('friends').del()
    })
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'User5', password: 'mypassword', calorie_intake: 2000, calorie_spend:1800},
        {username: 'User1', password: 'mypassword', calorie_intake: 1800, calorie_spend:1500},
        {username: 'User2', password: 'mypassword', calorie_intake: 2200, calorie_spend:1700},
        {username: 'User3', password: 'mypassword', calorie_intake: 2300, calorie_spend:1750},
        {username: 'User4', password: 'mypassword', calorie_intake: 1800, calorie_spend:500},
      ]);
    }).then(function() {
      return knex('friends').insert([
        {from: 'User1', to:'User2'},
        {from: 'User2', to:'User1'},
        {from: 'User2', to:'User5'},
        {from: 'User5', to:'User2'},
        {from: 'User3', to:'User5'},
        {from: 'User5', to:'User3'}
      ]);
    })
};
