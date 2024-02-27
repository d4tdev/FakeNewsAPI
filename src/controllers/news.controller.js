const xml2js = require('xml2js');
const fs = require('fs');
const { transformData } = require('../utils');
// Đọc dữ liệu từ tệp XML
function readXML(callback) {
   fs.readFile('./data.xml', 'utf-8', (err, data) => {
      if (err) {
         callback(err, null);
         return;
      }
      xml2js.parseString(data, (err, result) => {
         if (err) {
            callback(err, null);
            return;
         }
         callback(null, result);
      });
   });
}

// Ghi dữ liệu vào tệp XML
function writeXML(data, callback) {
   const builder = new xml2js.Builder();
   const xml = builder.buildObject(data);
   fs.writeFile('./data.xml', xml, 'utf-8', err => {
      if (err) {
         callback(err);
         return;
      }
      callback(null);
   });
}

class NewsController {
   // Thêm một mục mới vào file XML
   createNews = async (req, res) => {
      const { id, author, title, createdAt, content, image } = req.body;
      if (!id || !author || !title || !createdAt || !content || !image)
         return res.status(400).json({ error: 'Missing required fields' });

      // Đọc dữ liệu từ file XML
      fs.readFile('./data.xml', 'utf-8', (err, data) => {
         if (err) {
            res.status(500).json({ error: 'Internal Server Error', err });
            return;
         }

         xml2js.parseString(data, (err, result) => {
            if (err) {
               res.status(500).json({ error: 'Internal Server Error', err });
               return;
            }

            if (!result.posts) {
               result.posts = { post: [] };
            }

            const isExist = result.posts.post.some(post => post.id[0] == id);
            if (isExist) {
               res.status(400).json({ error: 'ID is exist' });
               return;
            }

            const newItem = {
               id: id,
               author,
               title: title,
               createdAt,
               content: content,
               image,
            };

            result.posts.post.push(newItem);
            writeXML(result, err => {
               if (err) {
                  res.status(500).json({ error: 'Internal Server Error' + err });
                  return;
               }
               return res.status(200).json({
                  message: 'Create new item successfully',
                  data: newItem,
               });
            });
         });
      });
   };

   getAllNews = async (req, res) => {
      readXML((err, data) => {
         if (err) return res.status(500).json({ err: 'Internal Server Error' + err });

         const transformedData = transformData(data);
         return res.status(200).json(transformedData);
      });
   };

   getANews = async (req, res, next) => {
      readXML((err, data) => {
         if (err) return res.status(500).json({ err: 'Internal Server Error' + err });

         console.log('', JSON.stringify(data));
         const transformedData = transformData(data);

         const { id } = req.params;
         if (!id) return res.status(400).json({ error: 'Missing required fields' });
         const item = transformedData.find(item => item.id == id);
         if (!item) return res.status(404).json({ error: 'Not Found' });
         return res.status(200).json(item);
      });
   };

   updateANews = async (req, res) => {
      const { author, title, createdAt, content, image } = req.body;
      if (!author || !title || !createdAt || !content || !image)
         return res.status(400).json({ error: 'Missing required fields' });

      readXML((err, data) => {
         if (err) return res.status(500).json({ err: 'Internal Server Error' + err });

         const { id } = req.params;
         if (!id) return res.status(400).json({ error: 'Missing required fields' });

         const transformedData = transformData(data);
         let result = { posts: { post: [] } };
         transformedData.map(post => {
            if (post.id === id) {
               post.author = author;
               post.title = title;
               post.createdAt = createdAt;
               post.content = content;
               post.image = image;
            }
            return post;
         });

         for (let i = 0; i < transformedData.length; i++) {
            result.posts.post.push(transformedData[i]);
         }
         writeXML(result, err => {
            if (err) {
               res.status(500).json({ error: 'Internal Server Error' + err });
            }

            return res.status(200).json(transformedData);
         });
      });
   };

   deleteANews = async (req, res) => {
      readXML((err, data) => {
         if (err) return res.status(500).json({ err: 'Internal Server Error' + err });

         const { id } = req.params;
         if (!id) return res.status(400).json({ error: 'Missing required fields' });

         const transformedData = transformData(data);
         let result = { posts: { post: [] } };
         transformedData.map(post => {
            if (post.id !== id) {
               result.posts.post.push(post);
            }
            return post;
         });

         writeXML(result, err => {
            if (err) {
               res.status(500).json({ error: 'Internal Server Error' + err });
            }

            return res.status(200).json(transformedData);
         });
      });
   };
   getNews = async (req, res) => {
      readXML((err, data) => {
         if (err) return res.status(500).json({ err: 'Internal Server Error' + err });

         console.log('', JSON.stringify(data));
         const transformedData = transformData(data);

         const { title } = req.query;
         console.log(title)
         if (!title) return res.status(400).json({ error: 'Missing required fields' });
         const item = transformedData.find(item => item.title.includes(title));
         if (!item) return res.status(404).json({ error: 'Not Found' });
         return res.status(200).json(item);
      });
   }
}

const NewController = new NewsController();
module.exports = NewController;
