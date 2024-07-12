import { useStateProvider } from "@/context/StateContext";
import { API } from "@/utils";
import { appLinks } from "@/utils/appLinks";
import { user } from "@repo/db";
import { useQuery } from "@tanstack/react-query";

export const useGetAllUsersQuery = () => {
  const { dispatch } = useStateProvider();
  return useQuery({
    queryKey: [appLinks.queryKeys.getAllUsers],
    queryFn: async () => {
      const response = await API.get(appLinks.getAllUsers);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.msg);
      }

      const allUser = response.data.data as user[];
      dispatch({ type: "SET_ALL_USERS", payload: allUser });
      return allUser;
    },
  });
};

export const useGetAllOnlineUsersIdQuery = () => {
  const { dispatch } = useStateProvider();
  return useQuery({
    queryKey: [appLinks.queryKeys.getAllOnlineUsersId],
    queryFn: async () => {
      const response = await API.get(appLinks.getAllOnlineUsersId);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.msg);
      }

      const allUser = response.data.data as string[];
      dispatch({ type: "SET_ALL_ONLINE_USERS_ID", payload: allUser });
      return allUser;
    },
  });
};
