const xml2js = require('xml2js');
const fs = require('fs');
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
   fs.writeFile('./data.xml', xml, err => {
      if (err) {
         callback(err);
         return;
      }
      callback(null);
   });
}

class BookController {
   // Thêm một mục mới vào file XML
   create = async (req, res) => {
      const { id, author, title, createdAt, content, image } = req.body;
      if (!id || !author || !title || !createdAt || !content || !image)
         return res.status(400).json({ error: 'Bad Request' });

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

            const builder = new xml2js.Builder();
            const xml = builder.buildObject(result);

            fs.writeFile('./data.xml', xml, err => {
               if (err) {
                  res.status(500).json({ error: 'Internal Server Error' + err });
                  return;
               }
               res.json({
                  message: 'Create new item successfully',
                  data: newItem,
               });
            });
         });
      });
   };

   read = async (req, res) => {
      readXML((err, data) => {
         if (err) {
            res.status(500).json({ err: 'Internal Server Error' + err });
            return;
         }

         // Biến đổi dữ liệu
         const transformedData = data.posts.post.map(post => {
            return {
               id: post.id[0],
               author: post.author[0],
               title: post.title[0],
               createdAt: post.createdAt[0],
               content: post.content[0],
               image: post.image[0],
            };
         });

         // Gửi dữ liệu đã biến đổi
         res.json(transformedData);
      });
   };
}

module.exports = new BookController();
