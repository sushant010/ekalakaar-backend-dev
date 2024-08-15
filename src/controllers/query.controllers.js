import Query from "../models/query.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";
import { sendQueryMails } from "../utils/mail.js";

const createQuery = catchAsync(async (req, res, next) => {
  const queryData = await Query.create({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    subject: req.body?.subject,
    phoneNumber: req.body.phoneNumber,
    // contactNumber:req.body.contactNumber,
    location: req.body?.location,
    link: req.body?.link,
    organization: req.body?.organization,
    intrestedIn: req.body?.intrestedIn,
  });

  if (!queryData) {
    throw new ApiError(500, "Something went wrong while registering the contact data");
  }

  sendQueryMails({ name: queryData.name, email: queryData.email, query: queryData });

  return res.status(201).json(new ApiResponse(201, queryData, "Contact data registered successfully."));
});

export { createQuery };
