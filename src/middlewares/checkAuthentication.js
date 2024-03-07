const checkLogin = (res, req, next) => {
    const data = localStorage.getItem("user");
    console.log(data);
    if (!data) { 
        return res.status(400).json({err: "You are not logged in!"});
     }
    next();
};

module.exports = {
    checkLogin,
}