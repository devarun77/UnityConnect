import express from "express";
import wrapAsync from "../utils/WrapAsync.js";
import {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionRequests,
  getUserGotConnectionRequest,
  acceptConnectionRequest,
  getUserProfileAndUserBasedOnUsername
} from "../controllers/user.controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.route("/register").post(wrapAsync(register));
router.route("/login").post(wrapAsync(login));

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), wrapAsync(uploadProfilePicture));

router.route("/user_update").post(wrapAsync(updateUserProfile));
router.route("/get_user_and_profile").get(wrapAsync(getUserAndProfile));
router.route("/update_profile_data").post(wrapAsync(updateProfileData));
router.route("/user/get_all_users").get(wrapAsync(getAllUserProfile));
router.route('/user/download_resume').get(wrapAsync(downloadProfile));
router.route('/user/send_connection_request').post(wrapAsync(sendConnectionRequest));
router.route('/user/getConnectionRequests').get(wrapAsync(getMyConnectionRequests));
router.route('/user/user_connection_request').get(wrapAsync(getUserGotConnectionRequest));
router.route('/user/accept_connection_request').post(wrapAsync(acceptConnectionRequest));
router.route("/user/get_profile_based_on_username").get(wrapAsync(getUserProfileAndUserBasedOnUsername));

export default router;
