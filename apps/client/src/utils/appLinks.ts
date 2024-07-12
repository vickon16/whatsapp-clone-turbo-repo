export const appLinks = {
  queryKeys: {
    getAllUsers: "get-all-users",
    getAllOnlineUsersId: "get-all-online-users-id",
    getAllUserPairs: "get-user-pairs",
    setReadMessages: "set-read-messages",
    generateToken: "generate-token",
  },

  home: "/",
  login: "/login",
  onboarding: "/onboarding",

  // auth route
  authRoute: `/api/auth`,
  get authCheckUserRoute() {
    return `${this.authRoute}/check-user`;
  },
  get authOnboardUserRoute() {
    return `${this.authRoute}/onboard-user`;
  },
  get generateToken() {
    return `${this.authRoute}/generate-token`;
  },

  // user route
  usersRoute: `/api/users`,
  get getAllUsers() {
    return `${this.usersRoute}`;
  },
  get getAllOnlineUsersId() {
    return `${this.usersRoute}/online-users-id`;
  },

  // message route
  messagesRoute: `/api/messages`,
  get getAllMessages() {
    return `${this.messagesRoute}`;
  },
  get setReadMessages() {
    return `${this.messagesRoute}/set-read-messages`;
  },
  get addPairMessages() {
    return `${this.messagesRoute}/add-pair-messages`;
  },
  get getAllUserPairs() {
    return `${this.messagesRoute}/get-all-user-pairs`;
  },
  get addImageMessage() {
    return `${this.messagesRoute}/add-image-message`;
  },
  get addAudioMessage() {
    return `${this.messagesRoute}/add-audio-message`;
  },
};
