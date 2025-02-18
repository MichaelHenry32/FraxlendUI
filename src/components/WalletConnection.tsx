'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState, useEffect } from 'react';

export function ConnectWalletButton() {
  const { connect } = useConnect();
  
  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Connect Wallet
    </button>
  );
}

export default function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until after mounting to prevent hydration errors
  if (!mounted) {
    return null;
  }

  if (!isConnected || !address) {
    return <ConnectWalletButton />;
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
      <button
        onClick={() => disconnect()}
        className="text-sm text-red-500 hover:text-red-600"
      >
        Disconnect
      </button>
    </div>
  );
} 