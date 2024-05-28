import { auth } from "../_lib/auth";

export const metadata = {
  title: "Account",
  description: "Account page",
};

export default async function Page() {
  const session = await auth();
  console.log(session);

  let firstName = "";
  if (session?.user?.name) {
    firstName = session.user.name.split(" ")[0];
  }
  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {firstName}
    </h2>
  );
}
