import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-10 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 bg-primary-200 rounded-lg p-8 shadow-lg">
        {/* Left Column */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-gray-800">Trustie</h1>
          <p className="text-xl text-white">
            The Money-Joy app for young people
          </p>

          <Link
            href="/home"
            className="inline-flex items-center px-6 py-3 text-xl font-bold text-white bg-primary hover:bg-primary/90 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Login to admin portal
          </Link>

          <div className="space-y-4">
            <p className="text-white">
              Help us build the ultimate Money-Joy app!
            </p>

            <p className="text-gray-700 text-sm">
              We&apos;re just getting started, and we need your help.
              <br />
              This is the first version of <b>Trustie</b>
              , and it&apos;s still a little rough around the edges. But
              that&apos;s where you come in! Download the app, give it a spin,
              and let us know what you think.
              <br />
              Spot any bugs or ideas to make it better? We&apos;re all ears!
            </p>

            <p className="text-black text-sm mt-4">
              Join the Trustie crew, and together we&apos;ll create something
              amazing. 👏
              <br />
              You in?
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex justify-center items-center">
          <Image
            src="https://trustie.co.uk/wp-content/uploads/2023/07/mobile-app_91.png"
            alt="Trustie App Preview"
            width={1280}
            height={1745}
            className="md:rotate-[30deg] transform scale-90 md:scale-100 transition-transform"
          />
        </div>
      </div>
    </main>
  );
}
