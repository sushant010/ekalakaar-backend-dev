export const DB_NAME = "ekalakaar";

export const AvailableUserRolesEnum = ["Artist", "Patron", "Art-lover", "Partner"];

export const AvailableContactSubjects = ["Business", "General", "Media", "Feedback", "Tech", "Suggestion", "Work"];

export const AvailableUserGender = ["Male", "Female", "Transgender", "Any other", "Prefer not to say"];
// export const AvailableUserGender = ["Male", "Female", "Other", ""];


export const AvailableOpportunityTimeSlot = ["Day", "Night"];

export const AvailableMediaType = ["Live", "Recorded"];

export const otpExpirationTime = new Date().getTime() + 600000;

export const AvailableApplicationStatus = ["Applied", "In-Progress", "Hired", "Rejected"];

export const maxUserAvatarSize = 1 * 1024 * 1024;

export const AvailableFileTypes = ["image", "video", "application"];
