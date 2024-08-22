import React from "react";
import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-10">
      {/* Link to go back to chats */}
      <Link
        href="/chat"
        className="flex items-start underline mt-5 text-lg mb-4 text-blue-500 hover:underline"
      >
        <ArrowBackIcon className="mr-2" />
        Back to chats
      </Link>

      {/* User profile section */}
      <UserProfile />
    </div>
  );
}

export default ProfilePage;
