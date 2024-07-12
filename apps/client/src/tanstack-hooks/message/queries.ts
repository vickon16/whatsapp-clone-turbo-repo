import { useStateProvider } from "@/context/StateContext";
import { API } from "@/utils";
import { appLinks } from "@/utils/appLinks";
import { TUserPairIncludes } from "@repo/db";
import { useQuery } from "@tanstack/react-query";

export const useSetReadMessage = ({
  senderId,
  receiverId,
}: {
  senderId?: string;
  receiverId?: string;
}) => {
  return useQuery({
    enabled: !!senderId && !!receiverId,
    queryKey: [appLinks.queryKeys.setReadMessages, { senderId, receiverId }],
    queryFn: async () => {
      const response = await API.get(
        `${appLinks.setReadMessages}?senderId=${senderId}&receiverId=${receiverId}`,
      );
      if (!response.data.success) {
        throw new Error(response.data.msg);
      }
      return response.data.data;
    },
    staleTime: 5000,
    refetchInterval: 5000,
  });
};

export const useGetAllUserPairsQuery = (senderId?: string) => {
  const { dispatch } = useStateProvider();
  return useQuery({
    enabled: !!senderId,
    queryKey: [appLinks.queryKeys.getAllUserPairs, { senderId }],
    queryFn: async () => {
      const response = await API.get(`${appLinks.getAllUserPairs}/${senderId}`);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.msg);
      }

      const allUserPairs = response.data.data as TUserPairIncludes[];
      dispatch({ type: "SET_ALL_USER_PAIRS", payload: allUserPairs });
      return allUserPairs;
    },
  });
};
