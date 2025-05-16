"use client";

import { useState } from "react";
import { searchUser } from "@/actions/searchUser";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorFallback } from '@components/ErrorFallback';
import { UserBasicInfo } from '@components/userBasicInfo';
import { TUser } from "@/constants/types";
import Select from "react-select";
import { Colors } from "@/themes/colors";
import { Button } from '@components/ui/button';

export default function UserSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TUser[] | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSearchResults(null);

    const formData = new FormData(event.currentTarget);
    const searchTerm = formData.get("searchTerm")?.toString();

    if (!searchTerm) {
      setIsLoading(false);
      return;
    }

    try {
      const usersArray = await searchUser(searchTerm);
      console.log("🚀 ~ handleSubmit ~ results:", usersArray);
      const params = new URLSearchParams(searchParams);
      if (usersArray.length === 1) {
        params.set("userId", usersArray[0].userId);
      } else {
        params.delete("userId");
      }
      replace(`${pathname}?${params.toString()}`);

      setSearchResults(usersArray || []);
      setIsLoading(false);
      console.log("is loggin false");
      if (usersArray.length === 1) {
        setSelectedUserId(usersArray[0].userId);
      } else {
        setSelectedUserId(null);
      }
    } catch (err) {
      setError(JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  };

  const userOptions =
    searchResults?.map((user) => ({
      value: user.userId,
      label: <UserBasicInfo basicProfile={user} size="small" />,
      user: user,
    })) || [];

  const handleUserSelect = (
    option: { value: string; label: JSX.Element; user: TUser } | null
  ) => {
    if (option) {
      const params = new URLSearchParams(searchParams);
      params.set("userId", option.value);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
      setSelectedUserId(option.value);
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex max-w-xl">
          <input
            id="searchTerm"
            name="searchTerm"
            type="text"
            className="flex-grow rounded-l-md border border-gray-300 shadow-sm focus:border-primary500 focus:ring-primary500 focus:ring-opacity-50 focus:outline-none pl-3"
            placeholder="Enter username, userId, email, or phone"
            required
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-primary-500 text-white py-2 px-4 rounded-none rounded-r-md hover:bg-primary600 focus:outline-none focus:ring-2 focus:ring-primary500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>
      {searchResults && searchResults.length === 0 ? (
        <p>No users found matching the search term.</p>
      ) : searchResults && searchResults.length > 1 ? (
        <div className="mb-4 max-w-xl">
          <label htmlFor="userSelect" className="block mb-2">
            Multiple matches. Please select a user:
          </label>
          <Select
            id="userSelect"
            options={userOptions}
            onChange={handleUserSelect}
            value={userOptions.find(
              (option) => option.value === selectedUserId
            )}
            className="w-full"
            classNamePrefix="react-select"
            formatOptionLabel={({ label }) => label}
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
      ) : null}
      {selectedUserId && (
        (() => {
          const user = searchResults?.find((u) => u.userId === selectedUserId);
          return user ? <UserBasicInfo basicProfile={user} size="large" /> : null;
        })()
      )}
    </ErrorBoundary>
  );
}
