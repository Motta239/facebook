import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FaceBookProvider from 'next-auth/providers/facebook'
import GitHubProvider from 'next-auth/providers/github'
import TwitterProvider from 'next-auth/providers/twitter'
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,

  callbacks: {
    async session({ session, token, user }) {
      session.username = session.user.name
        .split(' ')
        .join('')
        .toLocaleLowerCase()
      session.user.uid = token.sub
      return session
    },
  },
})
