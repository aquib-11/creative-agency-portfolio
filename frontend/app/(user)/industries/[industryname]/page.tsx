'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function ClientPage({
  params,
}: {
  params: Promise<{ clientName: string }>;
}) {
  const router = useRouter();
  const { clientName } = use(params);

  useEffect(() => {
    router.push(`/clients/${clientName}/videos`);
  }, [clientName, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" />
        </div>
      </div>
  );
}
