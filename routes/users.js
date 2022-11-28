const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { response } = require("express");

/*status codes 
400: bad rq
401: unauthorized
403:forbidden
404:notfound ; server can not find the requested resource
500:internal server error
*/


//UPDATE
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can only update your account");
  }

});



//delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    
    try {
        const user = await  User.findById(req.params.id);
      
      try{  
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      res.status(200).json(deletedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  }catch(err){
    res.status(404).json("User not found")
  }
  } else {
    res.status(401).json("You can only delete your account");
  }
});


//GET user

router.get("/:id",async(req,res) => {

  try{
    const user = await User.findById(req.params.id);
    const {password,...other} = user._doc;
    res.status(200).json(other);

  }catch(err){
    res.status(404).json(err);
  }

})

//Login
// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     !user && res.status(400).json("Wrong credentials!");

//     const validated = await bcrypt.compare(req.body.password, user.password);
//     !validated && res.status(400).json("Wrong credentials!");
//     const {password,...others} = user._doc;

//     res.status(200).json(others);

//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
