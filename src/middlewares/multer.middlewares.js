import multer from "multer";

import { cropImage, saveFile, validateFiles, validateFilesCount, getUniqueFileName } from "../../src/utils/helpers.js";
import ApiError from "../utils/ApiError.js";

export const upload = multer({ storage: multer.memoryStorage() });

const validateAvatarCount = (req, res, next) => {
  if (!validateFilesCount(req.files, 1)) {
    throw new ApiError("Please provide only one image", 400);
  }

  next();
};

const validateAvatar = (req, res, next) => {
  if (!validateFiles(req.files[0], "image")) {
    throw new ApiError("Invalid image file! Please provide only an image file", 400);
  }

  next();
};

const cropAvatar = async (req, res, next) => {
  req.files[0] = await cropImage(req.files[0]);

  next();
};

const saveAvatar = (req, res, next) => {
  const UniqueAvatarName = getUniqueFileName(req.files[0]);

  saveFile(req.files[0], UniqueAvatarName);

  next();
};

export const avatarValidationMiddlewares = [validateAvatarCount, validateAvatar, cropAvatar, saveAvatar];

const validatePerfImgCount = (req, res, next) => {
  if (!validateFilesCount(req.files, 6)) {
    throw new ApiError("Please upload a maximum of 6 image files", 400);
  }

  next();
};

const validatePerfImages = (req, res, next) => {
  if (!validateFiles(req.files, "image")) {
    throw new ApiError("Invalid image files! Please provide only image files", 400);
  }

  next();
};

const cropPerfImages = async (req, res, next) => {
  req.files = await Promise.all(req.files.map(async (file) => await cropImage(file)));

  next();
};

const savePerfImages = (req, res, next) => {
  req.files.forEach((file) => {
    const UniqueAvatarName = getUniqueFileName(file);

    saveFile(file, UniqueAvatarName);
  });

  next();
};

export const perfImgsValidationMiddlewares = [validatePerfImgCount, validatePerfImages, cropPerfImages, savePerfImages];

const validateVideosCount = (req, res, next) => {
  if (!validateFilesCount(req.files, 6)) {
    throw new ApiError("Please upload a maximum of 6 video files", 400);
  }

  next();
};

const validateVideos = (req, res, next) => {
  if (!validateFiles(req.files, "video")) {
    throw new ApiError("Invalid video files! Please provide only video files", 400);
  }

  next();
};

const saveVideos = (req, res, next) => {
  req.files.forEach((file) => {
    const UniqueAvatarName = getUniqueFileName(file);

    saveFile(file, UniqueAvatarName);
  });

  next();
};

export const videosValidationMiddlewares = [validateVideosCount, validateVideos, saveVideos];

const validatePdfCount = (req, res, next) => {
  if (!validateFilesCount(req.files, 1)) {
    throw new ApiError("Please upload only one pdf file", 400);
  }

  next();
};

const validatePdf = (req, res, next) => {
  if (!validateFiles(req.files[0], "application")) {
    throw new ApiError("Invalid image files! Please provide only image files", 400);
  }

  next();
};

const savePDf = (req, res, next) => {
  req.files.forEach((file) => {
    const UniqueAvatarName = getUniqueFileName(file);

    saveFile(file, UniqueAvatarName);
  });

  next();
};

export const pdfValidationMiddlewares = [validatePdfCount, validatePdf, savePDf];

const validateDocsCount = (req, res, next) => {
  if (!validateFilesCount(req.files, 6)) {
    throw new ApiError("Please upload a maximum of 6 Documents files", 400);
  }

  next();
};

/*const validateDocuments = (req, res, next) => {
  if (!validateFiles(req.files, "documents")) {
    throw new ApiError("Invalid Documents files! Please provide only files", 400);
  }

  next();
};*/

const saveDocuments = (req, res, next) => {
  req.files.forEach((file) => {
    const UniqueAvatarName = getUniqueFileName(file);

    saveFile(file, UniqueAvatarName);
  });

  next();
};

export const documentValidationMiddlewares = [validateDocsCount, saveDocuments];
