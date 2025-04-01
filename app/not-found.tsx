import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container>
      <div className="py-24 flex flex-col items-center justify-center text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-3xl font-semibold mt-6 mb-3">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mb-8">
          We couldn't find the page you were looking for. It might have been removed, renamed, or doesn't exist.
        </p>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </Container>
  );
} 