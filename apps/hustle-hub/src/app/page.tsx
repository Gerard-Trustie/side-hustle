import Image from "next/image";
import styles from "./page.module.css";

// Simple test data instead of importing from shared packages for now
const testUser = {
  userId: "123",
  userName: "testuser",
  email: "test@example.com",
  phoneNumber: "1234567890",
  givenName: "Test",
  familyName: "User",
  birthdate: "2000-01-01",
  userRole: "user",
  familyId: "fam-1",
  currency: "USD",
  appLevel: 0,
  appTheme: 0,
};

// Simple test utility function
function getOrderedPictures(pictures: string[]): string[] {
  return pictures.sort((a, b) => {
    const aOrder = parseInt(a.split('#')[0]) || 0;
    const bOrder = parseInt(b.split('#')[0]) || 0;
    return aOrder - bOrder;
  });
}

export default function Home() {
  const ordered = getOrderedPictures(["1#picA.jpg", "2#picB.jpg"]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Hustle Hub - Frontend App</h2>
        <div>
          <h3>Test Data:</h3>
          <pre>{JSON.stringify(testUser, null, 2)}</pre>
        </div>
        <div>Ordered pictures: {ordered.join(", ")}</div>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
