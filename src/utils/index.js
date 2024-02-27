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
};
