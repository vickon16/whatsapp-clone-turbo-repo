export const appLinks = {
  queryKeys: {
    getAllUsers: "get-all-users",
    getChatListMessages: "get-chat-list-messages",
    getPairMessages: "get-pair-messages",
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

  // user route
  usersRoute: `/api/users`,
  get getAllUsers() {
    return `${this.usersRoute}`;
  },

  // message route
  messagesRoute: `/api/messages`,
  get getAllMessages() {
    return `${this.messagesRoute}`;
  },
  get getPairMessages() {
    return `${this.messagesRoute}/get-pair-messages`;
  },
  get addPairMessages() {
    return `${this.messagesRoute}/add-pair-messages`;
  },
  get getChatListMessages() {
    return `${this.messagesRoute}/get-chat-list-messages`;
  },
};
