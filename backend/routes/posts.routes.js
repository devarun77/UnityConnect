import { Router } from "express";
import multer from "multer";
import wrapAsync from "../utils/WrapAsync.js";
import {
  get_comment_by_post,
  commentPost,
  createPost,
  deletePost,
  getAllPosts,
  delete_commment_of_user,
  increament_likes,
} from "../controllers/post.controller.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/post").post(upload.single("media"), wrapAsync(createPost));
router.route("/posts").get(wrapAsync(getAllPosts));
router.route("/delete_post").delete(wrapAsync(deletePost));
router.route("/comment").post(wrapAsync(commentPost));
router.route("/get_comments").get(wrapAsync(get_comment_by_post));
router.route("/delete_comment").delete(wrapAsync(delete_commment_of_user));
router.route("/increament_post_like").post(wrapAsync(increament_likes));

export default router;
