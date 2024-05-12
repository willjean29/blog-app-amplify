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
    }
  }
  if (!session) return null;
  return (
    <Authenticator>
      {({ user, signOut }) => (
        <div>
          <h1 className="text-3xl font-semibold tracking-wide mt-6 ">Profile</h1>
          <h1 className="font-medium text-gray-500 my-2">Username: {user.username}</h1>
          <h1 className="text-sm text-gray-500 m b-6">Email: {session?.email}</h1>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>

  )
}

export default Profile;