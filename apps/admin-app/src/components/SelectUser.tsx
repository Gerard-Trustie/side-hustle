import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Colors } from "@/themes/colors";
import { TUser } from '@types';
import { UserBasicInfo } from '@components/userBasicInfo';
import { searchUser } from "@/actions/searchUser";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface SelectUserProps {
  searchTerm: string;
  searchTitle: string;
  showUserInfo?: boolean;
}

const SelectUser: React.FC<SelectUserProps> = ({
  searchTerm,
  searchTitle,
  showUserInfo = true,
}) => {
  const [options, setOptions] = useState<TUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersArray = await searchUser(searchTerm);
        const params = new URLSearchParams(searchParams);

        if (usersArray?.length === 1) {
          params.set("userId", usersArray[0].userId);
          setSelectedUserId(usersArray[0].userId);
        } else {
          params.delete("userId");
          setSelectedUserId(null);
        }

        replace(`${pathname}?${params.toString()}`);
        setOptions(usersArray || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const userOptions = options.map((user) => ({
    value: user.userId,
    label: <UserBasicInfo basicProfile={user} size="small" />,
  }));

  const handleChange = (
    option: { value: string; label: React.ReactNode } | null
  ) => {
    const newUserId = option ? option.value : null;
    console.log("🚀 ~ newUserId:", newUserId);
    setSelectedUserId(newUserId);

    const params = new URLSearchParams(searchParams);
    if (newUserId) {
      params.set("userId", newUserId);
    } else {
      params.delete("userId");
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  console.log("🚀 ~ SelectTrustie selectedUserId:", selectedUserId, options);

  return (
    <>
      <div className="mb-4 max-w-md">
        <label
          htmlFor="userId"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {searchTitle}
        </label>
        <Select
          options={userOptions}
          value={userOptions.find((option) => option.value === selectedUserId)}
          onChange={handleChange}
          className="w-full"
          classNamePrefix="react-select"
          formatOptionLabel={({ label }) => label}
          isDisabled={isLoading || userOptions.length === 0}
          styles={{
            control: (provided, state) => ({
              ...provided,
              borderRadius: "0.375rem",
              borderColor: state.isFocused ? Colors.primary500 : "#D1D5DB",
              boxShadow: state.isFocused
                ? `0 0 0 1px ${Colors.primary500}`
                : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              "&:hover": {
                borderColor: state.isFocused
                  ? Colors.primary500
                  : Colors.primary200,
              },
              backgroundColor:
                isLoading || userOptions.length === 0 ? "#F3F4F6" : "white",
              opacity: isLoading || userOptions.length === 0 ? 0.6 : 1,
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? Colors.primary500 : "white",
              color: state.isSelected ? "white" : "black",
              "&:hover": {
                backgroundColor: state.isSelected
                  ? Colors.primary500
                  : "#F3F4F6",
              },
            }),
          }}
        />
      </div>
      {selectedUserId && showUserInfo && (() => {
        const user = options?.find((user) => user.userId === selectedUserId);
        return user ? <UserBasicInfo size="large" basicProfile={user} /> : null;
      })()}
    </>
  );
};

export default SelectUser;
