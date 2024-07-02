import { useStateProvider } from "@/context/StateContext";
import { API } from "@/utils";
import { appLinks } from "@/utils/appLinks";
import { TChatList, TUserPair } from "@repo/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPairMessagesQuery = ({
  senderId,
  receiverId,
}: {
  senderId?: string;
  receiverId?: string;
}) => {
  const queryClient = useQueryClient();
  const { dispatch } = useStateProvider();
  return useQuery({
    enabled: !!senderId && !!receiverId,
    queryKey: [appLinks.queryKeys.getPairMessages, { senderId, receiverId }],
    queryFn: async () => {
      const response = await API.get(
        `${appLinks.getPairMessages}?senderId=${senderId}&receiverId=${receiverId}`,
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.msg);
      }

      const pairMessages = response.data.data as TUserPair;
      dispatch({ type: "SET_PAIR_MESSAGES", payload: pairMessages.messages });
      queryClient.invalidateQueries({
        queryKey: [appLinks.queryKeys.getChatListMessages],
      });
      return pairMessages.messages;
    },
  });
};

export const useGetChatListMessagesQuery = (senderId?: string) => {
  return useQuery({
    enabled: !!senderId,
    queryKey: [appLinks.queryKeys.getChatListMessages, { senderId }],
    queryFn: async () => {
      const response = await API.get(
        `${appLinks.getChatListMessages}/${senderId}`,
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.msg);
      }
      return response.data.data as TChatList[];
    },
  });
};
