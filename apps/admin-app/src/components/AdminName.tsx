import { fetchUserAttributesFromServer } from '@utils/server-utils';

export const AdminName = async () => {
  try {
    const currentUser = await fetchUserAttributesFromServer();
    console.log("🚀 ~ AdminName ~ currentUser:", currentUser);
    
    if (!currentUser?.given_name) {
      return null; // Don't render anything if no user data
    }
    
    return <div className="text-xs font-medium">{currentUser.given_name}</div>;
  } catch (error) {
    // User is not authenticated - this is expected on login pages
    console.log("🔍 [AdminName] User not authenticated, not rendering name");
    return null; // Don't render anything if user is not authenticated
  }
};
