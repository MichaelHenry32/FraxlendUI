import { http, createConfig } from 'wagmi';
import { fraxtal } from 'wagmi/chains';

export const config = createConfig({
  chains: [fraxtal],
  transports: {
    [fraxtal.id]: http(),
  },
});