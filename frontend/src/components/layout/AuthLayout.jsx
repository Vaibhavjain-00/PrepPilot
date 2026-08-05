import Card from "../common/Card";
import Logo from "../common/Logo";

function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <Card className="w-full max-w-md">

        <div className="mb-8 text-center">

          <Logo />

          <h1 className="mt-6 text-3xl font-bold">
            {title}
          </h1>

          <p className="mt-2 text-gray-500">
            {subtitle}
          </p>

        </div>

        {children}

      </Card>

    </div>
  );
}

export default AuthLayout;