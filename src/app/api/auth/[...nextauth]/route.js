// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions = {
//   // output: 'export',

//   // Configure one or more authentication providers
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_SECRET_ID,
//     }),
//   ],
//   session: {
//     jwt: true,
//   },
//   callbacks: {
//     async jwt({ token, account, user }) {
//       // Initial sign in
//       if (account && user) {
//         token.id = user.id; // Add the ID from the user to the token
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // Add custom properties to the session
//       if (token) {
//         session.user.id = token.id; // Add the ID from the token to the session
//         session.accessToken = token.accessToken;
//       }
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
