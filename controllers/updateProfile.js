const cloudinary = require("../middleware/cloudinary");
const User = require("../models/User");

module.exports = {
  getEditProfile: async (req, res) => {
    try {
      const user = req.user
      console.log(user.userName)
      console.log('getEditProfile method called')
      res.render("editprofile.ejs", { username: user.userName, user });
    } catch (err) {
      console.log(err);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { id } = req.user;
      const user = await User.findById(id);
      
      let profilePictureUrl;
  
      // Handle profile photo upload
      if (req.file) {
        // Delete the old profile photo from Cloudinary
        if (user.profilePictureUrl && user.profilePictureUrl.public_id) {
          await cloudinary.uploader.destroy(user.profilePictureUrl.public_id);
        }

        // Upload the new profile photo to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Save the new profile photo data to the user object
        user.profilePictureUrl = {
        public_id: result.public_id,
        url: result.secure_url,
        };
      } else if (user.profilePictureUrl === "") {
        // if the user doesn't have a profile picture, set a default URL
        user.profilePictureUrl = {
        url: "https://res.cloudinary.com/dzjyle2lm/image/upload/v1678921753/defaultuserpic.png"
      }
    }
  
      // Update the user's profile picture URL
      profilePictureUrl = user.profilePictureUrl;

      console.log(user.profilePictureUrl);
  
      // Update the user's caption
      user.caption = req.body.caption;
  
      // Save the updated user object to the database
      await user.save();
  
      console.log("Caption:", req.body.caption);
      console.log("File:", req.file); 
  
      res.redirect(`/profile/${user.userName}`);
    } catch (error) {
      console.log(error);
      // res.render('error.ejs');
    }
  },
}