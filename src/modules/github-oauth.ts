import { env } from '../env'

interface AccessTokenResponse {
  access_token: string
}

interface getUserFromAccessTokenResponse {
  id: number
  name: string | null
  email: string | null
  avatar_url: string
}

export async function getAccessTokenFromCode(code: string) {
  const accessTokenUrl = new URL('https://github.com/login/oauth/access_token')

  accessTokenUrl.searchParams.append('client_id', env.GITHUB_CLIENT_ID)
  accessTokenUrl.searchParams.append('client_secret', env.GITHUB_CLIENT_SECRET)
  accessTokenUrl.searchParams.append('code', code)

  const response = await fetch(accessTokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  })

  const { access_token }: AccessTokenResponse = await response.json()

  return access_token
}

export async function getUserFromAccessToken(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data: getUserFromAccessTokenResponse = await response.json()

  return data
}
