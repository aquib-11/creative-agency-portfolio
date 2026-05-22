import multer from "multer";

const storage = multer.diskStorage({});

export const upload = multer({
  storage,

  limits: {
    fileSize: 1024 * 1024 * 100,
  },

  fileFilter: (req, file, cb) => {
    if (file.fieldname === "video") {
      if (!file.mimetype.startsWith("video/")) {
        return cb(new Error("Only video files are allowed"));
      }
    }

    if (file.fieldname === "thumbnail") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed"));
      }
    }

    cb(null, true);
  },
});