"use client"

import { Authenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useEffect, useState } from "react";

function Profile() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    checkUser();
  }, [])

  const checkUser = async () => {
    try {
      const currentSession = await fetchUserAttributes();
      setSession(currentSession);
    } catch (err) {
      // setUser(null);
    }
  }
  // if (!user) return null;
  return (
    <Authenticator>
      {({ user }) => (
        <div>
          <h1 className="text-3xl font-semibold tracking-wide mt-6 ">Profile</h1>
          <h1 className="font-medium text-gray-500 my-2">{user.username}</h1>
          <h1 className="font-medium text-gray-500 my-2">{session?.email}</h1>
        </div>
      )}
    </Authenticator>

  )
}

export default Profile;