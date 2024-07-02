import { API } from "@/utils";
import { appLinks } from "@/utils/appLinks";
import { user } from "@repo/db";
import { useQuery } from "@tanstack/react-query";

export const useGetAllUsersQuery = () => {
  return useQuery({
    queryKey: [appLinks.queryKeys.getAllUsers],
    queryFn: async () => {
      const response = await API.get(appLinks.getAllUsers);
      return response.data.data as {
        [key: string]: user[];
      };
    },
  });
};
