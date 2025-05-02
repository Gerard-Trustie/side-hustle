export const searchUser = `
  query searchUser($search: String!) {
    searchUser(search: $search) {
      userId
      picturePath
      picture
      preview
      givenName
      familyName
    }
  }
`;

export const getUserBasicProfile = `
  query GetUserBasicProfile($userId: String!) {
    getUserBasicProfile(userId: $userId) {
      userId
      primarySK
      globalKey
      appTheme
      appLevel
      email
      picturePath
      picture
      preview
      givenName
      familyName
      gender
      birthdate
      phoneNumber
      userRole
      created
      currency
      externalUserId
      adviserId
      firstUsed
      lastUsed
    }
  }
`;

export const getUserExtendedProfile = `
  query GetUserExtendedProfile($userId: String!) {
    getUserExtendedProfile(userId: $userId) {
      userId
      primarySK
      nationality
      street
      city
      postalCode
      country
      KYCStatus
      proofOfId
      proofOfResidence
    }
  }
`;

export const getUserSetting = `
  query GetUserSetting($userId: String!) {
    getUserSetting(userId: $userId) {
      userId
      primarySK
      privacyGoal
      privacyCont
      notification
      confirmation
      deviceName
      pushToken
    }
  }
`;
