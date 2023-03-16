const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
    getProfile: async (req, res) => {
    try {
      const getUserInfo = await User.findOne({ userName: req.params.userName });
      const userId = getUserInfo._id;
      const posts = await Post.find({ user: userId }).populate('user').sort({ createdAt: "desc" }).lean();
      const postCount = await Post.find({ user: userId }).countDocuments();
      res.render("profile.ejs", { posts, user: req.user, username: getUserInfo.userName, postCount: postCount });
    } catch (err) {
      console.log(err);
    }
  },

  // original logic for my getProfile method

  // getProfile: async (req, res) => {
  //   try {
  //     const user = await Post.find({ user: req.user.id }).sort({ createdAt: "desc" }).lean(); // posts of logged in user
  //     const posts = await Post.find({ user: req.params.userId }).populate('user').sort({ createdAt: "desc" }).lean(); // posts by userId

  //     const postCount = await Post.find({ user: req.params.userId }).countDocuments()

  //     const getUserInfo = await User.findById(req.params.userId) // finds user info from userId in params
  //     const username = getUserInfo.userName // gets username from user object
  //     res.render("profile.ejs", { posts, user: req.user, username: username, postCount: postCount })
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      let users = [];
      for(i in posts) {
        const user = await User.findById(posts[i].user)
        users.push(user.userName)
      }
      res.render("feed.ejs", { posts: posts, userName: users, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const user = await User.findById(post.user)
      const username = user.userName
      const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments: comments, username: username });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        bookTitle: req.body.title,
        image: result.secure_url, // dnt
        cloudinaryId: result.public_id, // dnt
        caption: req.body.caption, // dnt
        genres: req.body.genres,
        bookDescription: req.body.bookDescription,
        bookAuthor: req.body.bookAuthor,
        likes: 0,
        user: req.user.id,
      });

      const user = await User.findById(req.user.id).lean();
      const userName = user.userName;

      console.log("Post has been added!");
      // res.render("addpost.ejs")
      res.redirect(`/profile/${userName}`);
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id }, 
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likePostOnFeed: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id }, 
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/feed`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).lean();
      const userName = user.userName;
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.deleteOne({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect(`/profile/${userName}`);
    } catch (err) {
      res.redirect(`/profile/${userName}`);
    }
  },
  getAddPost: async (req, res) => {
    try {
      const user = await Post.find({ user: req.user.id }); 
      res.render("addpost.ejs", { user: req.user })
    } catch (err) {
      console.log(err)
    }
  },
  bookmarkPost: async (req, res) => {
    let bookmarked = false
    try {
      const post = await Post.findById({ _id: req.params.id })
      bookmarked = (post.bookmarks.includes(req.user.id))
    } catch (err) {
      console.error(err)
    }
    //if already bookmarked we will remove user from likes array
    if (bookmarked) {
      try {
        await Post.findOneAndUpdate({ _id: req.params.id },
          {
            $pull : {'bookmarks' : req.user.id}
          })
          
          console.log('Removed user from bookmarks array')
          res.redirect('back')
        } catch (err) {
          console.error(err)
        }
    }
      //else add user to bookmarked array
      else {
        try {
          await Post.findOneAndUpdate({ _id: req.params.id },
            {
              $addToSet : {'bookmarks' : req.user.id}
            })
            
            console.log('Added user to bookmarks array')
            res.redirect('back')
        } catch (err) {
            console.log(err)
        }
      }
  },
  getBookmarks: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" });
      res.render("bookmarks.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // getPostCount: async (req, res) => {
  //   try {
  //     const posts = await Post.find({ user: req.params.userId });  
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }
};
