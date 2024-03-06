const { v4: uuidv4 } = require('uuid');


module.exports = {
   transformData: data =>
      data.posts.post.map(post => {
         return {
            id: post.id[0],
            author: post.author[0],
            title: post.title[0],
            createdAt: post.createdAt[0],
            content: post.content[0],
            image: post.image[0],
         };
      }),
   transFormUser: data => data.users.user.map(user => {
      return {
         id: user.id[0],
         username: user.username[0],
         password: user.password[0],
         name: user.name[0],
         address: user.address[0],
         email: user.email[0],
      };
   }),
   createIdUser: () =>  {
      return uuidv4().substring(0, 4);
   }
};
