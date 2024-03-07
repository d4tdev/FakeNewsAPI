const xml2js = require('xml2js');
const fs = require('fs');
const { createIdUser, transFormUser } = require('../utils');

function readXML(callback) {
   fs.readFile('./user.xml', 'utf-8', (err, data) => {
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
   fs.writeFile('./user.xml', xml, 'utf-8', err => {
      if (err) {
         callback(err);
         return;
      }
      callback(null);
   });
}

class authenController {
   register = async (req, res) => {
      const { username, password, name, address, email } = req.body;
      if (!username || !password || !name || !address || !email) {
         return res.status(400).json({ err: 'Missing required fields' });
      }
      fs.readFile('./user.xml', 'utf-8', (err, data) => {
         if (err) {
            res.status(500).json({ error: 'Internal Server Error', err });
            return;
         }
         xml2js.parseString(data, (err, result) => {
            if (err) {
               res.status(500).json({ error: 'Internal Server Error', err });
               return;
            }

            if (!result.users) {
               result.users = { user: [] };
            }

            const users = result.users.user;

            const isExist = users.some(users => users.username[0] === username);
            if (isExist) {
               return res.status(400).json({ err: 'User already exists' });
            }

            const newItem = {
               id: createIdUser(),
               name,
               username,
               password,
               address,
               email,
            };

            result.users.user.push(newItem);
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
   login = async (req, res) => {
      readXML((err, data) => {
         if (err) return res.status(500).json({ err: 'Internal Server Error' + err });

         const transFormUsers = transFormUser(data);

         const { username, password } = req.body;
         console.log(username);
         if (!username) return res.status(400).json({ error: 'Missing required fields' });
         const item = transFormUsers.find(item => item.username.includes(username));
         if (!item) return res.status(404).json({ error: 'User Not Found' });
         const checkPassword = item.password.includes(password);
         if (!checkPassword) return res.status(404).json({ error: 'Password Required' });
         return res.status(200).json(item);
      });
   };
   getAllUser = async (req, res) => {
      readXML((err, data) => {
         if (err) return res.status(500).json({ err: 'Internal Server Error' + err });
         const transformedUser = transFormUser(data);
         console.log(user);
         return res.status(200).json(transformedUser);
      });
   };

   getUser = async (req, res) => {
      readXML((err, data) => {
         if (err) return res.status(500).json({ err: 'Internal Server Error' + err });
         const transFormUsers = transFormUser(data);
         const { name } = req.query;
         if (!name) return res.status(400).json({ error: 'Missing required fields' });
         const item = transFormUsers.find(item => item.name.includes(name));
         if (!item) return res.status(404).json({ error: 'User Not Found' });
         return res.status(200).json(item);
      });
   };
}

module.exports = new authenController();
