export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateIssueTitle = (title: string): boolean => {
  return title.length > 0 && title.length <= 150;
};

export const validateIssueDescription = (description: string): boolean => {
  return description.length >= 20;
};

export const validateIssueType = (type: string): boolean => {
  return type === 'bug' || type === 'feature_request';
};

export const validateIssueStatus = (status: string): boolean => {
  return ['open', 'in_progress', 'resolved'].includes(status);
};

export const validateUserRole = (role: string): boolean => {
  return role === 'contributor' || role === 'maintainer';
};
