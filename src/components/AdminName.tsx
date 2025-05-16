import { fetchUserAttributesFromServer } from '@utils/server-utils';

export const AdminName = async () => {
  const currentUser = await fetchUserAttributesFromServer();
  console.log("🚀 ~ AdminName ~ currentUser:", currentUser);

  return <div className="text-xs font-medium">{currentUser?.given_name}</div>;
};
